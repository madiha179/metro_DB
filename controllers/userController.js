const User=require('./../models/usermodel')
const catchAsync=require('./../utils/catchAsyncError')
exports.getUserByName=catchAsync(async (req,res,next)=>{
const user=await User.findById(req.user.id).select('name');
res.status(200).json({
  status:'success',
  data:{
    name:user.name
  },
})
})