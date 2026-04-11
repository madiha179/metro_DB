const express = require('express');
const TripController = require('./../controllers/TripInfoController');
const authController=require('./../controllers/authController')
const TripRouter = express.Router();

TripRouter.get('/station', TripController.getStation);
TripRouter.post('/info', authController.protect,TripController.tripInfo);

module.exports = TripRouter;