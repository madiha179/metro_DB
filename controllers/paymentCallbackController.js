const Payment = require('./../models/paymentmodel');
const crypto = require('crypto');
const pushNotifications=require('../utils/sendNotificationFirebase');
const notificationsHistory=require('../models/notificationsHistoryModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
}

exports.transactionProcessed = async (req, res) => {
  try {
    const parsedBody = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : req.body;

    console.log("Webhook received:", parsedBody);

    const hmac = req.query.hmac || parsedBody.hmac;
    const secret = process.env.PAYMOB_HMAC_SECRET;

    const paymobKeys = [
      "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id",
      "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
      "is_voided", "order.id", "owner", "pending", "source_data.pan", "source_data.sub_type",
      "source_data.type", "success"
    ];

    let collected = '';
    for (let i = 0; i < paymobKeys.length; i++) {
      const key = paymobKeys[i];
      const value = String(getNested(parsedBody.obj, key) ?? '');
      collected += value;
      console.log(`${key}:`, value);
    }

    console.log("Collected string:", collected);

    const calculatedHmac = crypto.createHmac("sha512", secret).update(collected).digest("hex");

    console.log("Calculated HMAC:", calculatedHmac);
    console.log("Received HMAC:", hmac);

    if (calculatedHmac !== hmac) {
      return res.status(403).json({ message: "HMAC validation failed" });
    }

    const orderId = Number(parsedBody.obj?.data?.order_info || parsedBody.obj?.order?.id);
    const success = parsedBody.obj?.success;
    const amountCents = Number(parsedBody.obj?.amount_cents) || 0;

    const updated = await Payment.findOneAndUpdate(
      { "payment_history.invoice_number": orderId },
        {$set: {
          "payment_history.$.payment_status": success ? "paid" : "failed",
          "payment_history.$.amount_paid": success ? amountCents / 100 : 0,
          "payment_history.$.paying_date": success ? new Date() : null
        },
      },
         { new: true }
    );
     if (!updated) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    console.log("Update result:", updated);
    console.log({ orderId, success, amountCents });
    if (success) {
     const title=`Ticket Payment`;
        const message=`Your payment was successful, and your Ticket is active`;
        const notificationDate=new Date().toLocaleDateString('en-EG');
        await pushNotifications(updated.userid,title,message);
        await notificationsHistory.create({userId:updated.userid,title:title,message:message,sendAt:notificationDate});
      }
    if (updated.modifiedCount === 0) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    return res.status(200).json({ message: "Callback received and DB updated" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: "Server error" });
  }
};