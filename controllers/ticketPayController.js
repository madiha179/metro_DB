const axios = require('axios');
const Ticket = require('../models/ticketmodel');
const User = require('../models/usermodel');
const UserTrips=require('../models/usersTripes');
const PaymentHistory = require('../models/paymentmodel');
const catchAsync = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const PAYMOB_IFRAME_ID=process.env.PAYMOB_IFRAME_ID;

// 1) Get Auth Token
async function getAuthToken() {
  const response = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, { api_key: PAYMOB_API_KEY });
  return response.data.token;
}

// 2) Create Order
async function createOrder(authToken, ticketPrice, ticketStations) {
  const response = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: ticketPrice * 100,
    currency: "EGP",
    items: [
      {
        name: "Metro Ticket",
        amount_cents: ticketPrice * 100,
        description: `${ticketStations} stations`,
        quantity: 1
      }
    ],
    shopify: false
  });

  return response.data.id;
}

// 3) Create Payment Key
async function createPaymentKey(authToken, orderId, user, ticketPrice, paymentMethod) {
  let integrationId;

  if(paymentMethod === 'fawry') {
    integrationId = process.env.PAYMOB_KIOSK_INTEGRATION_ID;
  } else if(paymentMethod === 'visa card') {
    integrationId = process.env.PAYMOB_CARD_INTEGRATION_ID;
  } else {
    throw new Error('Invalid payment method');
  }

  const [firstName, ...rest] = user.name.split(' ');
  const lastName = rest.join(' ') || 'NA';

  const response = await axios.post(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
    auth_token: authToken,
    amount_cents: ticketPrice * 100,
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

// 4) Save Payment History
async function createPaymentHistory(userId, ticketPrice, paymentMethod, invoiceNumber) {
  return PaymentHistory.create({
    userid: userId,
    payment_history: [{
      issuing_date: new Date(),
      amount_paid: ticketPrice,
      payment_method: paymentMethod,
      invoice_number: invoiceNumber,
      payment_status: 'pending'
    }]
  });
}

// Create Payment Key Endpoint
exports.createPayment = catchAsync(async (req, res, next) => {
  const { ticketId, paymentmethod } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return next(new AppError("Ticket not found", 404));

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));
  const userTrip = await UserTrips.findOne({ userId: req.user.id, ticketId: ticketId }).sort({ _id: -1 });
  if (!userTrip) return next(new AppError("UserTrip not found", 404));
  const totalPrice = userTrip.totalPrice;
  try {
    const authToken = await getAuthToken();
    const orderId = await createOrder(authToken, totalPrice, ticket.no_of_stations);
    const paymentKey = await createPaymentKey(authToken, orderId, user, totalPrice, paymentmethod);
    await createPaymentHistory(req.user.id, totalPrice, paymentmethod, orderId);

    res.status(200).json({
      success: true,
      paymentKey,
      orderId
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      message: "Payment failed. Please try again.",
      details: error.response?.data || error.message
    });
  }
});

async function payWithPaymob(paymentKey, paymentMethod) {
  let source;

  if(paymentMethod === 'visa card'){
    source = { identifier: "token", subtype: "CARD" };
  } else if(paymentMethod === 'fawry'){
    source = { identifier: "AGGREGATOR", subtype: "AGGREGATOR" };
  } else {
    throw new Error("Invalid payment method");
  }

  const response = await axios.post(`${PAYMOB_API_URL}/acceptance/payments/pay`, {
    source,
    payment_token: paymentKey
  });

  return response.data;
}
exports.fawryPay=catchAsync(async(req,res,next)=>{
 const  {paymentmethod,paymentkey} = req.body;
  try{
  const result= await payWithPaymob(paymentkey,paymentmethod);
    if(paymentmethod ==='fawry'){
      return res.status(200).json({
        success:true,
        bill_reference:result.data.bill_reference
      });
    }
     return next(new AppError("Invalid payment method", 400));
  } catch(err){
    return res.status(400).json({
      success:false,
      message:"Payment Feild",
      error:err.response?.data||err.message
    });
  }
});

exports.visaCardPay = catchAsync(async(req, res, next) => {
  const {paymentmethod,paymentkey}  = req.body;
  const iframeUrl=`https://accept.paymobsolutions.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentkey}`;
  try {
    if(paymentmethod === 'visa card'){
      return res.status(200).json({
        success: true,
        iframe_url: iframeUrl
      });
    }
     return next(new AppError("Invalid payment method", 400));
  } catch(err) {
    return res.status(400).json({
      success: false,
      message: "Payment failed",
      error: err.response?.data || err.message
    });
  }
});
