const express = require('express');
const callbackRouter = express.Router();
const paymentCallback = require('../controllers/paymentCallbackController');

callbackRouter.post('/', paymentCallback.transactionProcessed);

module.exports = callbackRouter;
