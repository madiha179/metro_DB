const express=require('express');
const ticketController=require('./../controllers/ticketController');
const ticketRoute=express.Router();
ticketRoute.post('/getTicketIdByPrice',ticketController.getTicketIdByPrice);
module.exports=ticketRoute;
