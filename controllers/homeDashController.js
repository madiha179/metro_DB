const stationsLocation = require('../models/stationsLocation');
const catchAsyncError = require('../utils/catchAsyncError');
exports.getAllLocations=catchAsyncError(async(req,res)=>{
const StationLocations=await stationsLocation.find({},{
  'name.en':1,
  'location':1,
  'line':1
}).sort({ 'line': 1, 'location.coordinates.1': 1 })
res.status(200).json(StationLocations);
});