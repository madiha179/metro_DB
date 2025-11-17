const express=require('express');
const authcontroller=require('./../controllers/authController');
const userRouter=express.Router();
userRouter.post('/register',authcontroller.SignUp);
userRouter.post('/forgotpassword',authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token',authcontroller.resetPassword);

//login
userRouter.post('/login',authcontroller.Login);


module.exports=userRouter;