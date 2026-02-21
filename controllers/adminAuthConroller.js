const Admin=require('./../models/adminmodel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
const jwt=require('jsonwebtoken');
const { promisify }=require('util');
const signToken=id=>{
  return jwt.sign({id},
    process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRESIN
    })};
    const createToken=(admin,statusCode,res)=>{
      const token=signToken(admin._id);
      const cookieOptions={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true
      }
      if(process.env.NODE_ENV==='production')
        cookieOptions.secure=true;
      res.cookie('jwt',token,cookieOptions);
      admin.password=undefined;
      res.status(statusCode).json({
        status:'success',
        token,
        data:{
          admin
        }
      });
    }
    exports.protect=catchAsyncError(async(req,res,next)=>{
  //1- get token and check 
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next (new appError('you are not logged in ! please login to get access',401));
  }
  //2- verification
  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  //3- check if Admin still exist
  const currentAdmin=await Admin.findById(decoded.id);
  if(!currentAdmin){
    return next(new appError('Admin no longer exist',401));
  }
  //let Admin access to protected
  req.admin=currentAdmin;
  next();
});
    exports.adminlogin=catchAsyncError(async(req,res,next)=>{
      const {email,password}=req.body;
      if(!email||!password){
        return next(new appError('Please Provide Email and Password',400));
      }
      const admin=await Admin.findOne({email}).select('+password');
      if(!admin||!await admin.correctpassword(password,admin.password))
      {
        return next (new appError('Email or password incorrect',401));
      }
      createToken(admin,200,res);
    });