const User=require('./../models/usermodel');
const Payment=require('./../models/paymentModel');
const wallet=require('./../models/walletModel')
const catchAsync=require('./../utils/catchAsyncError');
const filterObject=require('./../utils/filterObject');
exports.getUserByName=catchAsync(async (req,res,next)=>{
const user=await User.findById(req.user.id).select('name');
res.status(200).json({
  status:'success',
  data:{
    name:user.name
  },
})
});
exports.getUserEmail=catchAsync(async (req,res,next)=>{
const user=await User.findById(req.user.id).select('email');
res.status(200).json({
  status:'success',
  data:{
    email:user.email
  },
})
});
exports.getUserPhoto=catchAsync(async (req,res,next)=>{
const user=await User.findById(req.user.id).select('photo');
res.status(200).json({
  status:'success',
  data:{
    photo:user.photo
  },
})
});
exports.getUserVerified=catchAsync(async(req,res,next)=>{
  const user=await User.findById(req.user.id).select('verified');
  res.status(200).json({
    status:'success',
    data:{
      verified:user.verified
    }
  })
});
exports.updateusername=catchAsync(async(req,res,next)=>{
  const filterBody=filterObject(
    req.body,
    'name'
  )
 const updatedUserName=await User.findByIdAndUpdate(req.user.id,filterBody,{
  new: true,
  runValidators: true
 });
 res.status(200).json({
  status:'success',
  data:{
    name:updatedUserName.name
  }
 })
});
exports.updateuserphoto=catchAsync(async(req,res,next)=>{
  const filterBody=filterObject(
    req.body,
    'photo'
  )
 const updatedUserPhoto=await User.findByIdAndUpdate(req.user.id,filterBody,{
  new: true,
  runValidators: true
 });
 res.status(200).json({
  status:'success',
  data:{
    user:updatedUserPhoto.photo
  }
 })
});
exports.getPaymentMethod=catchAsync(async(req,res,next)=>{
  const userPayment=await Payment.findOne({userid:req.user.id}).select('payment_history.payment_method');
  if (!userPayment || userPayment.payment_history.length === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        payment_method: "no payments yet"
      }
    });
  }
  const history = userPayment?.payment_history || [];
  const lastMethod = history[history.length - 1]?.payment_method;
  res.status(200).json({
    status:'success',
    data:{
      payment_method:lastMethod
    }
  })
});
exports.getWalletBalance=catchAsync(async(req,res,next)=>{
  const userWallet=await wallet.findOne({userid:req.user.id});
    return res.status(200).json({
      status:'success',
      data:{
        balance:userWallet?.balance||0,
        currency:"EGP"
      }
    })
});