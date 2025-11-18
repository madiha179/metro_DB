const express=require('express');
const authcontroller=require('./../controllers/authController');
const userController=require('./../controllers/userController')
const userRouter=express.Router();
userRouter.post('/register',authcontroller.SignUp);
userRouter.post('/forgotpassword',authcontroller.forgotPassword);
userRouter.patch('/resetpassword/:token',authcontroller.resetPassword);
userRouter.patch('/changepassword',authcontroller.protect,authcontroller.changePassword);
userRouter.get('/profile/username',authcontroller.protect,userController.getUserByName);
module.exports=userRouter;