const express = require('express');
const callbackRouter = express.Router();
const ticketCallback = require('../controllers/paymentCallbackController');
const subCallback = require('../controllers/subscriptionPayCallbackController');

const SUB_INTEGRATION_ID = Number(process.env.PAYMOB_CARD_SUB_INTEGRATION_ID);

callbackRouter.post('/', async (req, res, next) => {
  try {
    const body = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : req.body;

    const type = body?.type;
    const integrationId = Number(body?.obj?.integration_id);

    console.log('Callback type:', type, '| integrationId:', integrationId);

    if (type === 'TOKEN') {
      const orderId = body?.obj?.order_id;
      const subPayment = await require('../models/subscriptionPaymentModel').findOne({
        "payment_history.invoice_number": {
          $in: [orderId, Number(orderId)]
        }
      });

      if (subPayment) {
        console.log('TOKEN → subscription callback');
        return subCallback.transactionProcessed(req, res, next);
      }

      console.log('TOKEN → ticket callback');
      return ticketCallback.transactionProcessed(req, res, next);
    }

    if (integrationId === SUB_INTEGRATION_ID) {
      console.log('TRANSACTION → subscription callback');
      return subCallback.transactionProcessed(req, res, next);
    }

    console.log('TRANSACTION → ticket callback');
    return ticketCallback.transactionProcessed(req, res, next);

  } catch (err) {
    console.error('Callback router error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = callbackRouter;