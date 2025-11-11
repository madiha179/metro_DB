const User=require('./../models/usermodel');
const jwt=require('jsonwebtoken');
const AppError=require('./../utils/appError');
const CatchAsync=require('./../utils/catchAsyncError');
const filterObj=require('./../utils/filterObject');
const Email=require('./../utils/sendEmail')
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
    const newUser= await User.create(filterBody);
    createSendToken(newUser,201,res);
});
exports.forgotPassword = CatchAsync(async (req,res,next)=>{
  // get user based on posted email 
  const user= await User.findOne({email:req.body.email});
  if(!user){return next(new AppError('user not found please try with another email',404))}
  //generate random reset Token
    const resetToken=user.createPasswordResetToken();
      console.log(resetToken);
    // save resetToken data
    await user.save({ validateBeforeSave: false});
  //send it to user email
  try{
  const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
  await new Email(user,resetURL).sendResetPassword();
  res.status(200).json({
    status:'success',
    message:'token sent to email'
  })
  }catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
     await user.save({ validateBeforeSave: false});
     return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});
exports.resetPassword ={};