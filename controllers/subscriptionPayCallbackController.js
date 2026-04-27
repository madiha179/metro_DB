const subscriptionPayment = require('./../models/subscriptionPaymentModel');
const subscriptionModel = require('./../models/subscriptionModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Duration_Months = {
  monthly: 1,
  quarterly: 3,
  'half yearly': 6,
  yearly: 12,
};

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

exports.transactionProcessed = async (req, res) => {
  try {
    const body = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : req.body;

    console.log('Webhook type:', body.type);

    if (body.type === 'TOKEN') {
      const { token, masked_pan, card_subtype, order_id } = body.obj;

      console.log('TOKEN order_id:', order_id, '| type:', typeof order_id);

      const result = await subscriptionPayment.findOneAndUpdate(
        {
          "payment_history.invoice_number": {
            $in: [order_id, Number(order_id), String(order_id)]
          }
        },
        { $set: { card_token: token, masked_pan, card_subtype } },
        { new: true }
      );

      console.log('TOKEN saved:', result ? `✅ order ${order_id}` : '❌ no record found');
      return res.status(200).json({ message: "Token saved" });
    }

    if (body.type === 'TRANSACTION') {
      const data = body.obj;
      const orderId = data?.order?.id;
      const success = data?.success;
      const amountCents = Number(data?.amount_cents) || 0;

      console.log('TRANSACTION orderId:', orderId, '| type:', typeof orderId);
      console.log('success:', success, '| amountCents:', amountCents);

      const updated = await subscriptionPayment.findOneAndUpdate(
        {
          "payment_history.invoice_number": {
            $in: [orderId, Number(orderId), String(orderId)]
          }
        },
        {
          $set: {
            "payment_history.$.payment_status": success ? "paid" : "failed",
            "payment_history.$.amount_paid": success ? amountCents / 100 : 0,
            "payment_history.$.paying_date": success ? new Date() : null
          }
        },
        { new: true }
      );

      console.log('Payment record updated:', updated ? '✅' : '❌ not found');

      if (success && updated) {
        const subscription = await subscriptionModel
          .findById(updated.subscriptionId)
          .populate('type', 'duration');

        console.log('Subscription found:', subscription ? '✅' : '❌');
        console.log('Duration:', subscription?.type?.duration?.en);

        if (subscription) {
          const durationEn = subscription.type?.duration?.en?.toLowerCase();
          const months = Duration_Months[durationEn] || 1;
          const start_date = new Date();
          const end_date = addMonths(start_date, months);

          const activated = await subscriptionModel.findByIdAndUpdate(
            updated.subscriptionId,
            { $set: { status: 'active', start_date, end_date } },
            { new: true }
          );

          console.log('✅ Subscription activated:', activated?.status, 'until:', activated?.end_date);
        }
      }

      return res.status(200).json({ message: "Transaction processed" });
    }

    return res.status(200).json({ message: "Webhook ignored" });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};