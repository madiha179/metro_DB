const userTrips=require('../models/usersTripes');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError=require('../utils/appError');
const getLang=require('../utils/getLang');
exports.userTripsHistory=catchAsyncError(async(req,res,next)=>{
 const lang =getLang(req);
 const userTrip=await userTrips.findOne({userId:req.user.id});
 if(!userTrip){
  return next(new AppError('No trip history found',404));
 }
 const formattedHistory=userTrip.trip_history.map(trip=>({
  fromStation:trip.fromStation[lang]||trip.fromStation.en,
  toStation:trip.toStation[lang]||trip.toStation.en,
  totalPrice:trip.totalPrice,
  trip_date:trip.trip_date.getDay,
  trip_date:trip.trip_date.getTime,
  payment_method:trip.payment_method
 }));
 res.status(200).json({
  status:'success',
  data:formattedHistory
 });
});