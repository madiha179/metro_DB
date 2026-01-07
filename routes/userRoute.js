const express=require('express');
const rateLimit=require('express-rate-limit');
const authcontroller=require('./../controllers/authController');
const userController=require('./../controllers/userController')
const userRouter=express.Router();
//some limits for number of requests for some authenication operations
const signupLimiter=rateLimit({
  max:50,
  windowMs:60*60*1000,
  message:"Too Many Requests from this IP , Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
});
const profileLimiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too Many Requests from this IP , Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
});
const resetPassLimiter=rateLimit({
  max:20,
  windowMs:60*60*1000,
  message:"Too Many attempts to reset password, Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
});
const forgotPassLimiter=rateLimit({
  max:20,
  windowMs:60*60*1000,
  message:"Too many forgot password attempts,Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
})
//authentication
userRouter.post('/register',signupLimiter,authcontroller.SignUp);
userRouter.post('/forgotpassword',forgotPassLimiter,authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token',resetPassLimiter,authcontroller.resetPassword);

//login section
userRouter.post('/login',authcontroller.Login);
userRouter.post('/logout',authcontroller.protect,authcontroller.logOUT)
//otp section
userRouter.post('/verifyOTP', authcontroller.verifyOTP);
userRouter.post('/resendOTP', authcontroller.resendOTP);
//profile
userRouter.patch('/changepassword',profileLimiter,authcontroller.protect,authcontroller.changePassword);
userRouter.get('/profile/username',profileLimiter,authcontroller.protect,userController.getUserByName);
userRouter.get('/profile/email',profileLimiter,authcontroller.protect,userController.getUserEmail);
userRouter.get('/profile/photo',profileLimiter,authcontroller.protect,userController.getUserPhoto);
userRouter.patch('/profile/updateuserphoto',profileLimiter,authcontroller.protect,userController.updateuserphoto);
userRouter.patch('/profile/updateusername',profileLimiter,authcontroller.protect,userController.updateusername);
userRouter.get('/profile/getpaymentmethod',profileLimiter,authcontroller.protect,userController.getPaymentMethod);
userRouter.get('/profile/getbalance',profileLimiter,authcontroller.protect,userController.getWalletBalance);
module.exports=userRouter;