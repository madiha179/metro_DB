const subscriptionPayment = require('./../models/subscriptionPaymentModel');
const subscriptionModel=require('./../models/subscriptionModel');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Duration_Months={
  'monthly':1,
  'quarterly':3,
  'half yearly':6,
  'yearly':12,
};

function addMonths(date,months){
  const d=new Date(date);
  d.setMonth(d.getMonth()+months);
  return d;
}

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
}
async function handleTokenWebkook(obj) {
  const {token,masked_pan,card_subtype,order_id}=obj;
  const updated=await subscriptionPayment.findOneAndUpdate(
    {"payment_history.invoice_number":order_id},
    {
      $set:{
        card_token:token,
        masked_pan:masked_pan,
        card_subtype:card_subtype,
      }
    },
    {new:true}
  );
  if(!updated){
    console.log(`TOKEN webhook: no payment record found for order_id ${order_id}`);
    return;
  }
  console.log(`Card token saved for order ${order_id}`);
}
async function handleTransactionWebhook(obj) {
  const orderId=obj?.order?.id;
  const success=obj?.success;
  const amountCents=Number(obj?.amount_cents)||0;
  console.log('orderId from webhook:', orderId, typeof orderId);
  const updated=await subscriptionPayment.findOneAndUpdate(
    {"payment_history.invoice_number":{ $in: [orderId, Number(orderId), String(orderId)] }},{
      $set:{
        "payment_history.$.payment_status":success ? "paid" : "failed",
        "payment_history.$.amount_paid":success? amountCents/100:0,
        "payment_history.$.paying_date":success? new Date():null,
      }
    },
    {new:true}
  );
  if(!updated){
    console.log(`TRANSACTION webhook: no payment record found for order ${orderId}`);
    return;
  }
  console.log(`Payment history updated for order ${orderId} — success: ${success}`);
  if(success){
    const subscription=await subscriptionModel.findById(updated.subscriptionId)
    .populate('type','duration');
    if(!subscription){
      console.log(` Subscription not found for payment record ${updated._id}`);
      return ;
    }
    const durationEn=subscription.type?.duration?.en?.toLowerCase();
      const months=Duration_Months[durationEn]||1;
      const start_date=new Date();
      const end_date=addMonths(start_date,months);
      await subscriptionModel.findByIdAndUpdate(updated.subscriptionId,{
        $set:{status:'active',start_date,end_date}
      });
      console.log(`Subscription ${updated.subscriptionId} activated until ${end_date}`);
  }
}
exports.transactionProcessed = async (req, res) => {
  try {
    const parsedBody = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : req.body;

    console.log("Webhook received, type:", parsedBody.type);
    if(parsedBody.type==='TOKEN'){
      await handleTokenWebkook(parsedBody.obj);
      return res.status(200).json({message:"Token saved"});
    }
    if(parsedBody.type==='TRANSACTION'){
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

  await handleTransactionWebhook(parsedBody.obj);
      return res.status(200).json({ message: "Transaction processed" });
    }
    return res.status(200).json({ message: "Webhook type ignored" });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};