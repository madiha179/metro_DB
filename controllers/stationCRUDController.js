const stataions=require('./../models/stationModel');
const catchAsyncError=require('./../utils/catchAsyncError');
const appError=require('./../utils/appError');
const ApiFeatures=require('./../utils/ApiFeatures');
exports.addStation=catchAsyncError(async(req,res,next)=>{
const {stationName,lineNumber,position,isTransfer,transferTo}=req.body;
 const newStation=await stataions.create(
  {name:stationName,line_number:lineNumber,position:position,is_transfer:isTransfer,transfer_to:transferTo});
  res.status(201).json({
    status:'succes',
    data:{
      station:newStation
    }
  })
});

exports.getAllStations=catchAsyncError(async(req,res,next)=>{
  if(!req.query.sort){
    req.query.sort='line_number,position';
  }
  if(!req.query.limit){
    req.query.limit='10';
  }
  const numOfStations=await stataions.find();
  const data=new ApiFeatures(stataions.find(),req.query)
  .sort().paginate();
  const allStations=await data.query;
  if (allStations.length === 0 && numOfStations.length > 0) {
    return next(new appError('No more stations, you have exceeded the available pages', 404));
  }
  if (numOfStations.length === 0) {
    return next(new appError('No Stations To Show', 404));
  }
  res.status(200).json({
    status:'success',
    stationsTotalLength:numOfStations.length,
    results:allStations.length,
    data:{
      allStations
    }
  })
});

exports.getStation=catchAsyncError(async(req,res,next)=>{
  const station=await stataions.findById(req.params.id);
  if(!station) 
    return next(new appError('Station Not Found',404));
  res.status(200).json({
    status:'success',
    data:{
      station
    }
  })
});

exports.updateStation=catchAsyncError(async(req,res,next)=>{
  const station=await stataions.findByIdAndUpdate(req.params.id, { $set: req.body },{
    new:true,
    runValidators: true
  });
    if(!station) 
    return next(new appError('Station Not Found To Update',404));
    res.status(200).json({
      status:'success',
      data:{
        station
      }
    })
});

exports.deleteStation=catchAsyncError(async(req,res,next)=>{
  const station=await stataions.findByIdAndDelete(req.params.id);
  if(!station)
  return next(new appError('Station Not Found To Delete',404));
  res.status(204).json({
    status:'success',
    message:'Station deleted successfly'
  })
});

exports.searchStation=catchAsyncError(async(req,res,next)=>{
  const station=await stataions.find({
    "$or":[
      {name:{$regex:req.params.key}}
    ]
  });
  if(!station)
    return next(new appError('Station Not Found',404));
  res.status(200).json({
    status:'success',
    data:{
      station
    }
  })
});