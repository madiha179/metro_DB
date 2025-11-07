const User=require('./../models/usermodel');
const jwt=require('jsonwebtoken');
const AppError=require('./../utils/appError');
const CatchAsync=require('./../utils/catchAsyncError');
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
    const newUser= await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirm_password:req.body.confirm_password,
         phone:req.body.phone,
         photo:req.body.photo,
         age:req.body.age,
         gender:req.body.gender,
         ssn:req.body.ssn
    });
    createSendToken(newUser,201,res);
})