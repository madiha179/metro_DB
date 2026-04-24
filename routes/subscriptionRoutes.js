const express = require('express');
const authcontroller=require('./../controllers/authController');
const { handleUploadErrors } = require('../utils/uploadMiddleware');
const { createSubscription, getMySubscription } = require('../controllers/subscriptionController');
const router = express.Router();

router.post('/subscription/create', authcontroller.protect, handleUploadErrors, createSubscription);
router.get('/subscription/me', getMySubscription);