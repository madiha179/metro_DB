const User=require('./../models/usermodel');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { promisify }=require('util');
const AppError=require('./../utils/appError');
const CatchAsync=require('./../utils/catchAsyncError');
const filterObj=require('./../utils/filterObject');
const Email=require('./../utils/sendEmail');

//sign token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });
};
// it create token to user when sigup ,login, resetpass
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
    const newUser= await User.create(filterBody);
    createSendToken(newUser,201,res);
});
exports.forgotPassword = CatchAsync(async (req,res,next)=>{
  // get user based on posted email 
  const user= await User.findOne({email:req.body.email});
  if(!user){return next(new AppError('user not found please try with another email',404))}
  //generate random reset Token
    const resetToken=user.createPasswordResetToken();
    // save resetToken data
    await user.save({ validateBeforeSave: false});
  //send it to user email
  try{
  const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
  await new Email(user,resetURL).sendResetPassword();
  res.status(200).json({
    data:{
     resetToken 
    },
    status:'success',
    message:'token sent to email'
  })
  }catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
     await user.save({ validateBeforeSave: false});
      console.log("EMAIL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log(" MESSAGE:", err.message);
     return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});
exports.resetPassword =CatchAsync(async(req,res,next)=>{
  //1- get user based on token
  const hashToken =crypto.createHash('sha256')
  .update(req.params.token)
  .digest('hex');
  const user=await User.findOne({passwordResetToken:hashToken,passwordResetExpires:{$gt:Date.now()}});
  //2- token has not Expired => user and set new pass
  if(!user){
    return next(new AppError('Token is invalid or expired'))}
    user.password=req.body.password,
    user.confirm_password=req.body.confirm_password,
    user.passwordResetToken=undefined,
    user.passwordResetExpires=undefined
    await user.save();
    //3-log user in 
    createSendToken(user,200,res);
});

exports.protect=CatchAsync(async(req,res,next)=>{
  //1- get token and check 
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next (new AppError('you are not logged in ! please login to get access',401));
  }
  //2- verification
  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  //3- check if user still exist
  const currentUser=await User.findById(decoded.id);
  if(!currentUser){
    return next(new AppError('user no longer exist',401));
  }
  //4 check if user changed password after token was create
  if(currentUser.changePasswordAfter(decoded.iat)){
    return next(new AppError('user recently change password! please login again',401));
  }
  //let user access to protected
  req.user=currentUser;
  next();
});
exports.changePassword=CatchAsync(async(req,res,next)=>{
  //1- get user 
  const user=await User.findById(req.user.id).select('+password');
  //2- compare currentpassword with user stored password
  if(!(await user.correctPassword(req.body.currentpassword,user.password))){
    return next(new AppError('Your current password is wrong',401));
  }
  user.password=req.body.password;
  user.confirm_password=req.body.confirm_password;
  await user.save();
  createSendToken(user,200,res)
})


//login section
exports.Login =CatchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password)
    return next(new AppError("Email and password are required!", 400));
  
  const user = await User.findOne({email}).select('+password');
  
  if(!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password!', 401));
  
  createSendToken(user, 200, res);
});

