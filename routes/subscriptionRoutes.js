const express = require('express');
const authcontroller=require('./../controllers/authController');
const { handleUploadErrors } = require('../utils/uploadMiddleware');
const { createSubscription, getMySubscription } = require('../controllers/subscriptionController');
const SubscriptionRouter = express.Router();

SubscriptionRouter.post('/create', authcontroller.protect, handleUploadErrors, createSubscription);
SubscriptionRouter.get('/me', authcontroller.protect, getMySubscription);

module.exports = SubscriptionRouter;