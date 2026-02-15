const express=require('express');
const nearestStationsController=require('../controllers/nearestStationController');
const nearestStationRoute=express.Router();
nearestStationRoute.get('/', nearestStationsController.getSatationWithIn);
module.exports=nearestStationRoute;