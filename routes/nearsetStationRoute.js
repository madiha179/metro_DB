const express=require('express');
const nearestStationsController=require('../controllers/nearestStationController');
const nearestStationRoute=express.Router();
nearestStationRoute.get('/:distance/center/:lat,:lng/unit/:unit', nearestStationsController.getSatationWithIn);
module.exports=nearestStationRoute;