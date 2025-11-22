const express=require('express');
const authcontroller=require('./../controllers/authController');
const userController=require('./../controllers/userController')
const userRouter=express.Router();
userRouter.post('/register',authcontroller.SignUp);
userRouter.post('/forgotpassword',authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token',authcontroller.resetPassword);

//login section
userRouter.post('/login',authcontroller.Login);
//otp section
userRouter.post('/verifyOTP', authcontroller.verifyOTP);
userRouter.post('/resendOTP', authcontroller.resendOTP);

userRouter.patch('/changepassword',authcontroller.protect,authcontroller.changePassword);
userRouter.get('/profile/username',authcontroller.protect,userController.getUserByName);
module.exports=userRouter;