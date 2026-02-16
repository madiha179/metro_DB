const express=require('express');
const ticketpaycontroller=require('./../controllers/ticketPayController');
const authController=require('./../controllers/authController');
const { body, param } = require('express-validator');
const validateRequest=require('./../utils/requestValidation');
const ticketPayRoute=express.Router();

ticketPayRoute.post('/ticketpaymentkey',authController.protect,[body('ticketId').notEmpty().withMessage('ticket is required').isMongoId().withMessage('Invalid ticketID'),
  body('paymentmethod').notEmpty().withMessage('payment method is required').isIn(['fawry', 'visa card']).withMessage('Invalid payment method')
],validateRequest,ticketpaycontroller.createPayment);
ticketPayRoute.get('/paymentconfirmation',authController.protect,ticketpaycontroller.paymentConfirm);
ticketPayRoute.post('/ticketfawrypayment',authController.protect,[
    body('paymentkey').notEmpty().withMessage('Payment key is required'),
  body('paymentmethod').notEmpty().withMessage('Payment method is required')
  ],
  validateRequest,ticketpaycontroller.fawryPay);
ticketPayRoute.post('/ticketvisapayment',authController.protect, [
   body('paymentkey').notEmpty().withMessage('Payment key is required'),
  body('paymentmethod').notEmpty().withMessage('Payment method is required')
  ],
  validateRequest,ticketpaycontroller.visaCardPay);
module.exports=ticketPayRoute;