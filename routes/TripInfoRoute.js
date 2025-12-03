const express = require('express');
const TripController = require('./../controllers/TripInfoController');
const TripRouter = express.Router();

TripRouter.get('/station', TripController.getStation);
TripRouter.post('/info', TripController.tripInfo);

module.exports = TripRouter;