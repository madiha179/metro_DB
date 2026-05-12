const express=require('express');
const subPaymentController=require('./../controllers/subscriptionPaymentController');
const authController=require('../controllers/authController');
const {body}=require('express-validator');
const validateRequest=require('../utils/requestValidation');
const subPaymentRoute=express.Router();
subPaymentRoute.use(authController.protect);
subPaymentRoute.post('/subscription-pay',[body('subscriptionId').notEmpty().withMessage('subscriptionId is required').isMongoId().withMessage('Invalid subscriptionId'),
  body('paymentmethod').notEmpty().withMessage('payment method is required').isIn(['cash', 'visa card']).withMessage('Invalid payment method')]
,subPaymentController.subPaymentController);
subPaymentRoute.post('/subscription-pay/visa',subPaymentController.visaPayController);
subPaymentRoute.get('/subscription-pay/status',subPaymentController.getStatus);
module.exports=subPaymentRoute;