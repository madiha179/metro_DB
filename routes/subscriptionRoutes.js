const express = require('express');
const authcontroller = require('./../controllers/authController');
const adminController = require('../controllers/adminAuthConroller');
const { handleUploadErrors } = require('../utils/uploadMiddleware');
const { createSubscription, getMySubscription, displaySubPlans, displaySubCategory } = require('../controllers/subscriptionController');
const { getAllSubscriptions, updateSubStatus, getSubDoc, getPendingSubscriptions } = require('../controllers/subscriptionDashController');
const SubscriptionRouter = express.Router();
const AdminSubRouter = express.Router();

SubscriptionRouter.get('/plans', displaySubPlans);
SubscriptionRouter.get('/plans/:category', displaySubCategory);
SubscriptionRouter.post('/create', authcontroller.protect, handleUploadErrors, createSubscription);
SubscriptionRouter.get('/me', authcontroller.protect, getMySubscription);

/////////////Admin////////////////
AdminSubRouter.get('/', adminController.protect, getAllSubscriptions);
AdminSubRouter.get('/getPending', adminController.protect, getPendingSubscriptions);
AdminSubRouter.patch('/:id/status', adminController.protect, updateSubStatus);
AdminSubRouter.get('/:id/documents/:docType', adminController.protect, getSubDoc);

module.exports = {SubscriptionRouter, AdminSubRouter};