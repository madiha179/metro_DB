const Payment = require('./../models/paymentmodel');

exports.transactionProcessed = async (req, res) => {
  try {
    const parsedBody = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : req.body;

    console.log("Webhook received:", parsedBody);

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
    console.error("Webhook error:", err);
    res.status(500).json({ message: "Server error" });
  }
};