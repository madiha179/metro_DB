const express=require('express');
const ticketController=require('./../controllers/ticketController');
const authController=require('./../controllers/authController');
const ticketRoute=express.Router();
ticketRoute.post('/getTicketIdByPrice',authController.protect,ticketController.getTicketIdByPrice);
module.exports=ticketRoute;
