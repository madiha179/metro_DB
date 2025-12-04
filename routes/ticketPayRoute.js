const express=require('express');
const ticketpaycontroller=require('./../controllers/ticketPayController');
const authController=require('./../controllers/authController')
const ticketPayRoute=express.Router();
ticketPayRoute.post('/ticketpaymentkey',authController.protect,ticketpaycontroller.createPayment);
ticketPayRoute.post('/ticketfawrypayment/:paymentkey',authController.protect,ticketpaycontroller.fawryPay);
ticketPayRoute.post('/ticketvisapayment/:paymentkey',authController.protect,ticketpaycontroller.visaCardPay)
module.exports=ticketPayRoute;