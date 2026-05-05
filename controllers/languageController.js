const catchAsyncError=require('../utils/catchAsyncError');
const appError=require('../utils/appError');
const User=require('../models/usermodel');
exports.updatePreferredLang=catchAsyncError(async(req,res,next)=>{
const {lang}=req.body;
if(!['ar','en'].includes(lang))
  return next(new appError('Invalid language. Use ar or en',400));
const updateUserLang=await User.findByIdAndUpdate(
  req.user.id,
  {$set:{preferredLanguage:lang}},
  {new:true}
).select('preferredLanguage');
res.status(200).json({
  status:'success',
  data:{updateUserLang}
});
});