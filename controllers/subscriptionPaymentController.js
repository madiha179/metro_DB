const axios=require('axios');
const Users=require('../models/usermodel');
const subscriptions=require('../models/subscriptionModel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
const subscriptionPayment=require('../models/subscriptionPaymentModel');
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
  const amountCents=subscription.type.price*100;
  const response=await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`,{
    auth_token:authToken,
    amount_cents:amountCents,
    delivery_needed:false,
    currency:"EGP",
    items:[{
      name:"metro subscription",
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
       expire_date:new Date(Date.now()+60*60+1000),
      amount_paid:subscriptionPrice,
      payment_method: paymentMethod,
      invoice_number: invoiceNumber,
      payment_status: 'pending'
    }]
  });
}
exports.subPaymentController=catchAsyncError(async (req,res,next)=>{
  const {paymentMethod,subscriptionId}=req.body;
  if(!paymentMethod||!subscriptionId)
    return next(new appError("Please provide payment method and subscriptionId",400));
  const user=await Users.findById(req.user.id);
  if (!user) return next(new appError("User not found", 404));
  const subscription=await subscriptionModel.findById(subscriptionId);
  if(!subscription) return next(new appError("subscription not found",404));
  
    
})