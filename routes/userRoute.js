const express=require('express');
const authcontroller=require('./../controllers/authController');
const userController=require('./../controllers/userController')
const userRouter=express.Router();
//authentication
userRouter.post('/register',authcontroller.SignUp);
userRouter.post('/forgotpassword',authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token',authcontroller.resetPassword);
//userRouter.post('/logout',authcontroller.logout);

//login section
userRouter.post('/login',authcontroller.Login);
//otp section
userRouter.post('/verifyOTP', authcontroller.verifyOTP);
userRouter.post('/resendOTP', authcontroller.resendOTP);
//profile
userRouter.patch('/changepassword',authcontroller.protect,authcontroller.changePassword);
userRouter.get('/profile/username',authcontroller.protect,userController.getUserByName);
userRouter.get('/profile/email',authcontroller.protect,userController.getUserEmail);
userRouter.get('/profile/photo',authcontroller.protect,userController.getUserPhoto);
userRouter.get('/profile/verified',authcontroller.protect,userController.getUserVerified);
userRouter.put('/profile/updateuserphoto',authcontroller.protect,userController.updateuserphoto);
userRouter.put('/profile/updateusername',authcontroller.protect,userController.updateusername);
userRouter.get('/profile/getpaymentmethod',authcontroller.protect,userController.getPaymentMethod);
userRouter.get('/profile/getbalance',authcontroller.protect,userController.getWalletBalance);
module.exports=userRouter;