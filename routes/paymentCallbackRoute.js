const express=require('express');
const callbackRouter=express.Router();
const paymentCallback = require('../controllers/paymentCallbackController');
callbackRouter.post('/', 
  express.raw({ type: 'application/json' }), 
  paymentCallback.transactionProcessed);
module.exports = callbackRouter;