const express=require('express');
const homeDashController=require('../controllers/homeDashController');
const adminController=require('../controllers/adminAuthConroller');
const homeDashRouter=express.Router();
homeDashRouter.get('/alllocations',adminController.protect,homeDashController.getAllLocations);
module.exports=homeDashRouter;