const stationLocation=require('../models/stationsLocation');
const CatchAsync=require('../utils/catchAsyncError');
const AppError=require('../utils/appError');
exports.getSatationWithIn = CatchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  if (!latlng) {
    return next(new AppError('Please Provide Latitude and Longitude', 400));
  }
  const [lat, lng] = latlng.split(',').map(el => parseFloat(el));
  const distanceNum = parseFloat(distance);
  if (isNaN(lat) || isNaN(lng) || isNaN(distanceNum)) {
    return next(new AppError('Invalid latitude, longitude or distance', 400));
  }
  const radius =unit === 'mi' ? distanceNum / 3963.2: distanceNum / 6378.1;
  const nearestStations = await stationLocation.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });
  res.status(200).json({
    status: 'success',
    results: nearestStations.length,
    data: { nearestStations }
  });
});
