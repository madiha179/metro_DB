const express = require('express');
const authcontroller=require('./../controllers/authController');
const { handleUploadErrors } = require('../utils/uploadMiddleware');
const { createSubscription, getMySubscription, displaySubPlans, displaySubCategory } = require('../controllers/subscriptionController');
const SubscriptionRouter = express.Router();

SubscriptionRouter.get('/plans', displaySubPlans);
SubscriptionRouter.get('/plans/:category', displaySubCategory);
SubscriptionRouter.post('/create', authcontroller.protect, handleUploadErrors, createSubscription);
SubscriptionRouter.get('/me', authcontroller.protect, getMySubscription);

module.exports = SubscriptionRouter;