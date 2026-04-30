const stationBRTModel=require('../models/BRTStationsModel');
const ticketBRTModel=require('../models/BRTTicketModel');
const appError=require('../utils/appError');
const catchAsyncError=require('../utils/catchAsyncError');
const ApiFeatures=require('../utils/ApiFeatures');
const getLang=require('../utils/getLang');

const AVERAGE_DISTANCE_KM = 2.69;
const SPEED_KMH = 30;
const STOP_TIME_MIN = 3;
exports.getAllBRTStationsController=catchAsyncError(async(req,res,next)=>{
  if (!req.query.sort) {
        req.query.sort = 'position';
    }
    const data=new ApiFeatures(stationBRTModel.find(),req.query)
    .sort();
  const getAllBRTStations=await data.query;
  if(!getAllBRTStations||getAllBRTStations.length===0){
    return next(new appError('Stations not found',400));
  }
  const lang=getLang(req);
  const stations=getAllBRTStations.map(station=>({
    _id:station._id,
    position:station.position,
    name:station.name[lang]
  })
);
  res.status(200).json({
    status:'success',
    data:{
      allStations:stations    
    }
  });
});
exports.getRouteController = catchAsyncError(async (req, res, next) => {
  const { startStation, endStation } = req.body;
  const lang = getLang(req);

  if (!startStation || !endStation) {
    return next(new appError('please choose start and end station for get route', 400));
  }

  if (startStation === endStation) {
    return next(new appError('Start and end stations cannot be the same', 400));
  }

  const [start, end] = await Promise.all([
    stationBRTModel.findOne({ [`name.${lang}`]: new RegExp(`^${startStation}`, 'i') }),
    stationBRTModel.findOne({ [`name.${lang}`]: new RegExp(`^${endStation}$`, 'i') }),
  ]);

  if (!start || !end) {
    return next(new appError('One or both stations not found', 404));
  }

  const minPosition = Math.min(start.position, end.position);
  const maxPosition = Math.max(start.position, end.position);

  const stationBetweens = await stationBRTModel
    .find({ position: { $gte: minPosition, $lte: maxPosition } })
    .sort('position');

  const stops = maxPosition - minPosition;
  const totalDistance = (stops * AVERAGE_DISTANCE_KM).toFixed(2);
  const travelTime = ((totalDistance / SPEED_KMH) * 60).toFixed(0);
  const stopTime = stops * STOP_TIME_MIN;
  const totalTime = parseInt(travelTime) + stopTime;
const price = await ticketBRTModel.findOne({ 
  noOfStations: { $gte: stops } 
}).sort('noOfStations').select('price -_id');
  res.status(200).json({
    status: 'success',
    data: {
      from: start.name[lang] || start.name.en,
      to: end.name[lang] || end.name.en,
      stops,
      distance: `${totalDistance} km`,
      travelTime: `${travelTime} min`,
      price: price ,
      stations: stationBetweens.map(s => ({
        name: s.name[lang] || s.name.en,
      })),
    },
  });
});