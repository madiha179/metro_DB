const express=require('express');
const ticketController=require('./../controllers/ticketController');
const ticketRoute=express.Router();
ticketRoute.get('/getalltickets',ticketController.getAllTickets);
module.exports=ticketRoute;
