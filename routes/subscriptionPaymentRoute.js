const express=require('express');
const subPaymentController=require('./../controllers/subscriptionPaymentController');
const authController=require('../controllers/authController');
const subPaymentRoute=express.Router();
subPaymentRoute.use(authController.protect);
subPaymentRoute.post('/subscription-pay',subPaymentController.subPaymentController);
subPaymentRoute.post('/subscription-pay/visa',subPaymentController.visaPayController);
module.exports=subPaymentRoute;