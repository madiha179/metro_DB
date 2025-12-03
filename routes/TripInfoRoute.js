const express = require('express');
const TripController = require('./../controllers/TripInfoController');
const TripRouter = express.Router();

TripRouter.get('/station', TripController);
TripRouter.post('/tripInfo', TripController.tripInfo);

module.exports = TripRouter;