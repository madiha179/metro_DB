const {Admin}=require('../models/adminmodel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
exports.createAdminController=catchAsyncError(async(req,res,next)=>{
  const {email,name,ssn,password,role}=req.body;
  if(!email||!name||!ssn||!password||!role)
    {
      return next (new appError('Please provide all new Admin data',400));
  }
  const newAdmin= await Admin.create({
    email,
    name,
    ssn,
    password,
    role
  });
  res.status(200).json({
    status:'success',
    data:newAdmin
  });
})
exports.getAllAdminsController=catchAsyncError(async(req,res,next)=>{
const allAdmins=await Admin.find();
if(!allAdmins||allAdmins.length === 0){
  return next (new appError('No data found',400));
}
res.status(200).json({
    status:'success',
    data:allAdmins
  });
});
exports.deletAdmin=catchAsyncError(async(req,res,next)=>{
  const admin=await Admin.findByIdAndDelete(req.params.id);
  if(!admin){
    return next(new appError('Admin not found',400));
  }
  res.status(204).json({
    status:'success'
  });
});