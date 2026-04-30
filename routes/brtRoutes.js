const express=require('express');
const stationBRTController=require('../controllers/stationsBRTController');
const brtRouter=express.Router();
brtRouter.get('/allstations',stationBRTController.getAllBRTStationsController);
brtRouter.get('/route',stationBRTController.getRouteController);
module.exports=brtRouter;