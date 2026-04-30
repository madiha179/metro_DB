const express=require('express');
const homeDashController=require('../controllers/homeDashController');
const adminController=require('../controllers/adminAuthConroller');
const homeDashRouter=express.Router();
homeDashRouter.use(adminController.protect);
homeDashRouter.get('/alllocations',homeDashController.getAllLocations);
homeDashRouter.get('/ticketanalysis',homeDashController.getTicketAnalysis);
homeDashRouter.get('/subscriptionanalysis',homeDashController.getSubscriptionAnalysis);
module.exports=homeDashRouter;