const crypto = require('crypto');
const Payment = require('./../models/paymentmodel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
}

exports.transactionProcessed = async (req, res) => {
  try {
    let parsedBody;
    if (Buffer.isBuffer(req.body)) {
      parsedBody = JSON.parse(req.body.toString('utf8'));
    } else {
      parsedBody = req.body;
    }

    const hmac = req.query.hmac || parsedBody.hmac;
    const secret = process.env.PAYMOB_HMAC_SECRET;

    const relevantKeys = [
      "amount_cents","created_at","currency","error_occured","has_parent_transaction","id",
      "integration_id","is_3d_secure","is_auth","is_capture","is_refund","is_standalone_payment",
      "is_void","order","owner","pending","source_data.pan","source_data.sub_type",
      "source_data.type","success"
    ];

    const collected = relevantKeys.map(k => getNested(parsedBody, k)).join('');
    const calculated = crypto.createHmac("sha512", secret).update(collected).digest("hex");

    if (calculated !== hmac) {
      return res.status(403).json({ message: "HMAC validation failed" });
    }

    console.log("PAYMOB CALLBACK:", parsedBody);

    const orderId = parsedBody.order?.id;
    const success = parsedBody.success;
    const amountCents = parsedBody.amount_cents;

    const updated = await Payment.updateOne(
      { "payment_history.invoice_number": orderId },
      {
        $set: {
          "payment_history.$.payment_status": success ? "paid" : "failed",
          "payment_history.$.amount_paid": amountCents / 100,
          "payment_history.$.paying_date": success ? new Date() : null
        }
      }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    return res.status(200).json({ message: "Callback received and DB updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};