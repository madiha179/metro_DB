const userTripsHistory=require('../controllers/userTripHistoryController');
const express=require('express');
const authController=require('../controllers/authController');
const userTripsHistoryRouter=express.Router();
userTripsHistoryRouter.get('/usertriphistory',authController.protect,userTripsHistory.userTripsHistory);
module.exports=userTripsHistoryRouter;