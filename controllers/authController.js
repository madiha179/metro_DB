const User=require('./../models/usermodel');
const jwt=require('jsonwebtoken');
const AppError=require('./../utils/appError');
const CatchAsync=require('./../utils/catchAsyncError');
const filterObj=require('./../utils/filterObject');
//sign token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });
};
const createSendToken=(user,statusCode,res)=>{
  const token=signToken(user._id);
  const cookieOptions={
    // determine thecookie expire data  from cuurent time and transform cookie expire data from days to mille seconds 
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
  }
  if(process.env.NODE_ENV==='production')
    cookieOptions.secure=true;
  res.cookie('jwt',token,cookieOptions);
  //remove password from output
  user.password=undefined;
  res.status(statusCode).json({
    status:'success',
    token,
    data:{
      user
    }
  });
};
exports.SignUp=CatchAsync(async (req,res,next)=>{
  const filterBody=filterObj(
    req.body,
    'name',
    'email',
    'password',
    'confirm_password',
    'phone',
    'photo',
    'age',
    'gender',
    'ssn');
    const existingUser= await User.findOne({email:filterBody.email});
    if(existingUser){
      return next(new AppError('User with this email already exist',400));
    }
    const newUser= await User.create(filterBody);
    createSendToken(newUser,201,res);
})