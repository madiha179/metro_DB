const subscriptionPayment = require('./../models/subscriptionPaymentModel');
const subscriptionModel = require('./../models/subscriptionModel');
const pushNotifications=require('../utils/sendNotificationFirebase');
const notificationsHistory=require('../models/notificationsHistoryModel');
const crypto=require('crypto');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const PAYMOB_SUB_HMAC_SECRET=process.env.PAYMOB_SUB_HMAC_SECRET;

function getNested(obj,path){
  return path.split('.').reduce((acc,key)=>
  acc?.[key],obj) ?? '';
}
function validateHMAC(data,receiveHmac){
  const fields=[
    "amount_cents","created_at","currency","error_occured","has_parent_transaction",
    "id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment",
    "is_voided","order.id","owner","pending","source_data.pan","source_data.sub_type",
    "source_data.type","success"
  ];
  let collected="";
  for(const field of fields){
    collected+=String(getNested(data,field) ?? "");
  }
  const calculated=crypto
  .createHmac("sha512",PAYMOB_SUB_HMAC_SECRET)
  .update(collected)
  .digest("hex");
  return calculated === receiveHmac;
}

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

      console.log('TOKEN saved:', result ? ` order ${order_id}` : ' no record found');
      return res.status(200).json({ message: "Token saved" });
    }

    if (body.type === 'TRANSACTION') {
      const data = body.obj;
      const hmac=req.query.hmac||body.hmac;
      if(!validateHMAC(data,hmac)){
        console.log('HMAC validation failed');
        return res.status(403).json({message: "HMAC validation failed" });
      }
      console.log('HMAC vaild');

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

      console.log('Payment record updated:', updated ? 'found' : ' not found');

      if (success && updated) {
        const subscription = await subscriptionModel
          .findById(updated.subscriptionId)
          .populate('type', 'duration');

        console.log('Subscription found:', subscription ? 'found' : 'not found');
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

          console.log(' Subscription activated:', activated?.status, 'until:', activated?.end_date);
        const title=`Subscription Payment`;
        const message=`Your payment was successful, and your subscription is active until ${end_date} `;
        const notificationDate=new Date().toLocaleDateString('en-EG');
        await pushNotifications(subscription.user._id,title,message);
        await notificationsHistory.create({userId:subscription.user._id,title:title,message:message,sendAt:notificationDate});
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