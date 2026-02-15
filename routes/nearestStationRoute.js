const express=require('express');
const nearestStationsController=require('../controllers/nearestStationController');
const nearestStationRoute=express.Router();
nearestStationRoute.get('/:lat/:lng', nearestStationsController.getSatationWithIn);
module.exports=nearestStationRoute;