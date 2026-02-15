const express=require('express');
const nearestStationsController=require('../controllers/nearestStationController');
const nearestStationRoute=express.Router();
nearestStationRoute.get('/:distance/:lat/:lng/:unit', nearestStationsController.getSatationWithIn);
module.exports=nearestStationRoute;