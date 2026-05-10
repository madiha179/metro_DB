const express=require('express');
const nearestStationsController=require('../controllers/nearestStationController');
const nearestStationRoute=express.Router();
nearestStationRoute.get('/:lat/:lng', nearestStationsController.getSatationWithIn);
nearestStationRoute.get('/crowding/:lat/:lng',nearestStationsController.getStationCrowdingController);
module.exports=nearestStationRoute;