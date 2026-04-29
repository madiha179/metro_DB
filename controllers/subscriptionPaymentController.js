const axios=require('axios');
const Users=require('../models/usermodel');
const subscriptions=require('../models/subscriptionModel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
const subscriptionPayment=require('../models/subscriptionPaymentModel');
const getLang=require('../utils/getLang');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const PAYMOB_IFRAME_ID=process.env.PAYMOB_IFRAME_ID;
const integrationId = process.env.PAYMOB_CARD_INTEGRATION_ID;

//helper functions
async function getAuthToken() {
  const response=await axios.post(`${PAYMOB_API_URL}/auth/tokens`,{api_key:PAYMOB_API_KEY});
  return response.data.token;
}
async function createOrder(authToken,subscription) {
  const amountCents=subscription.type.prices*100;
  const response=await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`,{
    auth_token:authToken,
    amount_cents:amountCents,
    delivery_needed:false,
    currency:"EGP",
    items:[{
      name:"metro subscription",
      amount_cents: amountCents,  
      description: "Metro Subscription",  
      quantity: 1 
    }
    ]
  });
  return response.data.id;
}
async function createPaymentKey(authToken,orderId,user,subscriptionPrice) {
  const [firstName,...rest]=user.name.split(' ');
  const lastName=rest.join(' ')||'NA';
  const response=await axios.post(`${PAYMOB_API_URL}/acceptance/payment_keys`,{
    auth_token:authToken,
    amount_cents:subscriptionPrice*100,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone_number: user.phone,
      apartment: "NA",
      floor: "NA",
      building: "NA",
      street: "NA",
      city: "Cairo",
      state: "NA",
      country: "EG"
    },
    currency: "EGP",
    integration_id: integrationId
  });
  return response.data.token;
}
async function createPaymentHistory(userId,subscriptionId,subscriptionPrice,paymentMethod,invoiceNumber) {
  return subscriptionPayment.create({
    userId:userId,
    subscriptionId:subscriptionId,
    payment_history:[{
      issuing_date: new Date(),
       expire_date:new Date(Date.now()+60*60*1000),
      amount_paid:subscriptionPrice,
      payment_method: paymentMethod,
      invoice_number: invoiceNumber,
      payment_status: 'pending'
    }]
  });
}
async function payWithPaymob(paymentKey, paymentMethod) {
  if(paymentMethod === 'visa card'){
   const source = { identifier: "token", subtype: "CARD" };
  }
  else{
    throw new Error("Invalid payment method");
  }
  const response = await axios.post(`${PAYMOB_API_URL}/acceptance/payments/pay`, {
      source,
      payment_token: paymentKey
    });
  
    return response.data;
}
//controllers 
exports.subPaymentController=catchAsyncError(async (req,res,next)=>{
  const lang=getLang(req);
  const {paymentMethod,subscriptionId}=req.body;
  if(!paymentMethod||!subscriptionId)
    return next(new appError("Please provide payment method and subscriptionId",400));
  const user=await Users.findById(req.user.id);
  if (!user) return next(new appError("User not found", 404));
  const subscription=await subscriptions.findById(subscriptionId)
  .populate('type','prices category duration')
  .populate('office','officeName workingHours address');
  if(!subscription) return next(new appError("subscription not found",404));
  if(subscription.user.toString()!==req.user.id)
    return next(new appError("This subscription does not belong to you",403));
  if (subscription.status !== 'accepted')
    return next(new appError(`Payment not allowed. Subscription status is "${subscription.status}".`, 400));
  const subscriptionPrice=await subscription.type.prices;
  if(paymentMethod==='cash'){
    const issuingDate =Date.now();
    const cashPayment=await subscriptionPayment.create({
      userId:user.id,
      subscriptionId:subscriptionId,
      payment_history:[{
        issuing_date:issuingDate,
        amount_paid:subscriptionPrice,
        payment_method:'cash',
        payment_status: 'pending'
      }]
    });
    res.status(200).json({
      status:'success',
      data:{
       payment:{
        issuingDate,
        amount:subscriptionPrice,
        currency:'EGP',
        paymentMethod:'cash',
       },
       office:{
        name:subscription.office.officeName[lang],
        workingHours:subscription.office.workingHours
       },
       subscription:{
        category:subscription.type.category[lang],
        duration:subscription.type.duration[lang],
        status:subscription.status,
       }
      }
    });
  }
    if(paymentMethod==='visa card'){
          const issuingDate=Date.now();
      try{
        const authToken=await getAuthToken();
        const orderId=await createOrder(authToken,subscription);
        const paymentKey=await createPaymentKey(authToken,orderId,user,subscriptionPrice);
        await createPaymentHistory(user.id,subscriptionId,subscriptionPrice,paymentMethod,orderId);
       return res.status(200).json({
          status:'success',
          paymentKey
        });
      }
      catch(err){
        res.status(400).json({
          status:'false',
          message: "Payment failed. Please try again.",
          details:err.response?.data || err.message
        });
      }
    }
});
exports.visaPayController=(req,res,next)=>{
  const {paymentKey,paymentMethod}=req.body;
  const iframeUrl=`https://accept.paymobsolutions.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
  try{
    if(paymentMethod==='visa card')
    {
     return res.status(200).json({
        status:'success',
        iframeUrl:iframeUrl
      });
    }
    return next(new appError("Invalid payment method", 400));
  }
  catch(err){
    return res.status(400).json({
      success: false,
      message: "Payment failed",
      error: err.response?.data || err.message
    });
  }
}
exports.confirmPayment = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id);
  if (!user) return next(new appError("User not found", 404));

  const userPayment = await subscriptionPayment.findOne({ userId: req.user.id }).sort({createdAt:-1});

  if (!userPayment || !userPayment.payment_history.length) {
    return next(new appError('No payment history found', 404));
  }

  const latestPayment = userPayment.payment_history.at(-1);

  res.status(200).json({
    status: 'success',
    data: {
      userName: user.name,
      payment: {
        invoice_number: latestPayment.invoice_number,
        payment_method: latestPayment.payment_method,
        issuing_date: latestPayment.issuing_date.toISOString().split('T')[0],
        amount_paid: latestPayment.amount_paid
      }
    }
  });
});
exports.getStatus=catchAsyncError(async(req,res,next)=>{
  const user=await Users.findById(req.user.id);
  if(!user)
return next(new appError("User not found", 404));
  const SubscriptionStatus=await subscriptions.findOne({user:req.user.id}).select('status');
  if(!SubscriptionStatus)
    return next(new appError("Subscription not found", 404));
  res.status(200).json({
    status:'success',
    data:{
      status:SubscriptionStatus.status
    }
  });
});