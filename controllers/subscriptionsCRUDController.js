const subscriptionsTypesModel=require('./../models/subscriptionsTypesModel');
const subscriptionsOfficeModel=require('./../models/subscriptionOfficesModel');
const ApiFeatures=require('./../utils/ApiFeatures');
const AppError=require('./../utils/appError');
const catchAsyncError=require('./../utils/catchAsyncError');
exports.getAllSubscriptionsTypes=catchAsyncError(async(req,res,next)=>{
  if(!req.query.limit){
    req.query.limit='10';
  }
  const features=new ApiFeatures(
    subscriptionsTypesModel.find({},{
      'category.en':1,
      'duration.en':1,
      zones:1,
      prices:1
    }),
    req.query
  )
  .filter()
  .sort()
  .limitFeild()
  .paginate();
  const subscriptionTypes=await features.query;
  if(subscriptionTypes.length===0){
    return next(new AppError('No more subscription Types, you have exceeded the available pages', 404));
  }
  res.status(200).json({
    success:true,
    count:subscriptionTypes.length,
    data:subscriptionTypes
  });
});
exports.createSubscriptionType=catchAsyncError(async(req,res,next)=>{
  const {zones,category,duration,prices}=req.body;
  if(!zones||!category||!duration||!prices){
    return next(new AppError('Please Provide zones, category, duration, prices',400));
  }
  const categoryEn=typeof category==='string'?category:category.en;
  const categoryAr=typeof category==='object'?category.ar:undefined;
  const durationEn=typeof duration==='string'?duration:duration.en;
  const durationAr=typeof duration==='object'?duration.ar:undefined;
  const exisitng=await subscriptionsTypesModel.findOne({
    zones,
    'category.en':categoryEn,
    'duration.en':durationEn
  });
  if(exisitng){
    return next(new AppError('This subscription type already exists',400));
  }
  const newSubscriptionType=await subscriptionsTypesModel.create({
    zones,
    category:{en:categoryEn,ar:categoryAr},
    duration:{en:durationEn,ar:durationAr},
    prices
  });
  res.status(201).json({
    success:true,
    data:newSubscriptionType
  });
});
exports.updateSubscriptionTypes=catchAsyncError(async(req,res,next)=>{
  const{zones,category,duration,prices}=req.body;
  const updateData={};
  if(zones) updateData.zones=zones;
  if(prices) updateData.prices=prices;
  if (category) {
    updateData['category.en'] = typeof category === 'string' ? category : category.en;
    if (typeof category === 'object' && category.ar)
      updateData['category.ar'] = category.ar;
  }
  if (duration) {
    updateData['duration.en'] = typeof duration === 'string' ? duration : duration.en;
    if (typeof duration === 'object' && duration.ar)
      updateData['duration.ar'] = duration.ar;
  }
  const updateSubscriptionType=await subscriptionsTypesModel.findByIdAndUpdate(
    req.params.id,
    {$set:updateData},
    {new:true,runValidators:true}
  );
  if(!updateSubscriptionType){
    return next(new AppError('Subscription Type Not Found',404));
  }
  res.status(200).json({
    success:true,
    data:updateSubscriptionType
  });
});
exports.deleteSubscriptionType=catchAsyncError(async(req,res,next)=>{
  const subscriptionType=await subscriptionsTypesModel.findByIdAndDelete(req.params.id);
  if(!subscriptionType){
    return next(new AppError('Subscription Type Not Found',404));
  }
  res.status(204).json({
    status:'success'
  });
});