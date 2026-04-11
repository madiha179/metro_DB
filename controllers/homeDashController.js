const stationsLocation = require('../models/stationsLocation');
const catchAsyncError = require('../utils/catchAsyncError');
exports.getAllLocations=catchAsyncError(async(req,res)=>{
const StationLocations=await stationsLocation.find({},{
  '_id':0,
  'name.en':1,
  'location':1,
  'line':1
}).sort({ 'line': 1, 'location.coordinates.1': 1 });
const formatted=StationLocations.map(station=>({
  name:station.name.en,
  line:station.line,
  lat:station.location.coordinates[1],
  lng:station.location.coordinates[0]
}));
res.status(200).json({
  success:true,
  count:formatted.length,
  data:formatted
});
});