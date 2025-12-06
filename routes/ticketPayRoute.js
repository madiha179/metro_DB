const express=require('express');
const ticketpaycontroller=require('./../controllers/ticketPayController');
const authController=require('./../controllers/authController');
const { body, param } = require('express-validator');
const validateRequest=require('./../utils/requestValidation');
const ticketPayRoute=express.Router();

ticketPayRoute.post('/ticketpaymentkey',authController.protect,[body('ticketId').notEmpty().withMessage('ticket is required').isMongoId().withMessage('Invalid ticketID'),
  body('paymentmethod').notEmpty().withMessage('payment method is required').isIn(['fawry', 'visa card']).withMessage('Invalid payment method')
],validateRequest,ticketpaycontroller.createPayment);

ticketPayRoute.post('/ticketfawrypayment/:paymentkey',authController.protect,[
    param('paymentkey')
      .notEmpty().withMessage('Payment key is required')
  ],
  validateRequest,ticketpaycontroller.fawryPay);
ticketPayRoute.post('/ticketvisapayment/:paymentkey',authController.protect, [
    param('paymentkey')
      .notEmpty().withMessage('Payment key is required')
  ],
  validateRequest,ticketpaycontroller.visaCardPay);
// use express.raw bec => paymob send HMAC build in row body 
ticketPayRoute.post('/paymob-webhook', express.raw({ type: 'application/json' }), ticketpaycontroller.handleWebhook);
module.exports=ticketPayRoute;