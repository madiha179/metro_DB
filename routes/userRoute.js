const express=require('express');
const authcontroller=require('./../controllers/authController');
const userRouter=express.Router();
userRouter.post('/register',authcontroller.SignUp);
module.exports=userRouter;