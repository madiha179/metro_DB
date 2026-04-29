const express=require('express');
const chatBotController=require('../controllers/chatBotController');
const authController=require('../controllers/authController');
const chatBotRouter=express.Router();
chatBotRouter.use(authController.protect);
chatBotRouter.post('/chatbot',chatBotController.chatBotController);
module.exports=chatBotRouter;