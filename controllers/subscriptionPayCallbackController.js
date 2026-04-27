const subscriptionPayment = require('./../models/subscriptionPaymentModel');
const subscriptionModel = require('./../models/subscriptionModel');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Duration_Months = {
  'monthly': 1,
  'quarterly': 3,
  'half yearly': 6,
  'yearly': 12,
};

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function handleTokenWebhook(obj) {
  const { token, masked_pan, card_subtype, order_id } = obj;
  await subscriptionPayment.findOneAndUpdate(
    { "payment_history.invoice_number": { $in: [order_id, Number(order_id), String(order_id)] } },
    { $set: { card_token: token, masked_pan, card_subtype } },
    { new: true }
  );
}

async function handleTransactionWebhook(obj) {
  const orderId = obj?.order?.id;
  const success = obj?.success;
  const amountCents = Number(obj?.amount_cents) || 0;

  const updated = await subscriptionPayment.findOneAndUpdate(
    { "payment_history.invoice_number": { $in: [orderId, Number(orderId), String(orderId)] } },
    {
      $set: {
        "payment_history.$.payment_status": success ? "paid" : "failed",
        "payment_history.$.amount_paid": success ? amountCents / 100 : 0,
        "payment_history.$.paying_date": success ? new Date() : null,
      }
    },
    { new: true }
  );

  if (success && updated) {
    const subscription = await subscriptionModel
      .findById(updated.subscriptionId)
      .populate('type', 'duration');

    if (subscription) {
      const durationEn = subscription.type?.duration?.en?.toLowerCase();
      const months = Duration_Months[durationEn] || 1;
      const start_date = new Date();
      const end_date = addMonths(start_date, months);

      await subscriptionModel.findByIdAndUpdate(
        updated.subscriptionId,
        { $set: { status: 'active', start_date, end_date } }
      );
    }
  }
}

exports.transactionProcessed = async (req, res) => {
  try {
    const body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body;
    const obj = body.obj;

    if (body.type === 'TOKEN') {
      await handleTokenWebhook(obj);
      return res.status(200).json({ message: "Token saved" });
    }

    if (body.type === 'TRANSACTION') {
      const hmac = req.query.hmac;
      const secret = process.env.PAYMOB_HMAC_SECRET;

      const paymobKeys = [
        "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id",
        "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
        "is_voided", "order.id", "owner", "pending", "source_data.pan", "source_data.sub_type",
        "source_data.type", "success"
      ];

      let collected = "";
      paymobKeys.forEach((key) => {
        let value;
        if (key === "order.id") {
          value = obj.order?.id;
        } else if (key.startsWith("source_data.")) {
          const subKey = key.split(".")[1];
          value = obj.source_data?.[subKey];
        } else {
          value = obj[key];
        }

        if (value === null || value === undefined) {
          value = "";
        } else {
          value = String(value);
        }
        collected += value;
      });

      const calculatedHmac = crypto.createHmac("sha512", secret).update(collected).digest("hex");

      if (calculatedHmac !== hmac) {
        return res.status(403).json({ message: "HMAC validation failed" });
      }

      await handleTransactionWebhook(obj);
      return res.status(200).send("<h1>Payment Successful</h1>");
    }

    return res.status(200).json({ message: "Webhook ignored" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};