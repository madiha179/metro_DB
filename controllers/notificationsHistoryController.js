const notificationsHistory=require('../models/notificationsHistoryModel');
const catchAsyncError=require('../utils/catchAsyncError');
const appError=require('../utils/appError');
exports.getNotficationsHistory=catchAsyncError(async(req,res,next)=>{
  const notificationsHistoryData = await notificationsHistory
    .find({userId: req.user.id}) 
    .sort({sendAt: -1})
    .lean();
  if(!notificationsHistoryData||notificationsHistoryData.length===0){
    return next(new appError('No notifications history found',400));
  }
  const formatted = notificationsHistoryData.map(n => ({
  ...n,
  sendAt: new Date(n.sendAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}));
  res.status(200).json({
    status:'success',
    data:{
      notificationsHistoryData:formatted
    }
  });
});