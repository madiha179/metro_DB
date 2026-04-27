const express = require('express');
const authcontroller=require('./../controllers/authController');
const adminController=require('../controllers/adminAuthConroller');
const { handleUploadErrors } = require('../utils/uploadMiddleware');
const { createSubscription, getMySubscription, displaySubPlans, displaySubCategory } = require('../controllers/subscriptionController');
const { getAllSubscriptions, updateSubStatus, getSubDoc } = require('../controllers/subscriptionDashController');
const SubscriptionRouter = express.Router();

SubscriptionRouter.get('/plans', displaySubPlans);
SubscriptionRouter.get('/plans/:category', displaySubCategory);
SubscriptionRouter.post('/create', authcontroller.protect, handleUploadErrors, createSubscription);
SubscriptionRouter.get('/me', authcontroller.protect, getMySubscription);

/////////////Admin////////////////
SubscriptionRouter.get('/', adminController.protect, getAllSubscriptions);
SubscriptionRouter.patch('/:id/status', adminController.protect, updateSubStatus);
SubscriptionRouter.get('/:id/documents/:docType', adminController.protect, getSubDoc);

module.exports = SubscriptionRouter;