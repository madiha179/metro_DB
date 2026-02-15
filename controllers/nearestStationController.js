const CatchAsync = require('../utils/catchAsyncError')
const AppError = require('../utils/appError');
const stationLocation = require('../models/stationsLocation');
exports.getSatationWithIn = CatchAsync(async (req, res, next) => {
  const { distance, lat, lng, unit } = req.query;

  if (!lat || !lng || !distance) {
    return next(new AppError('Please provide latitude, longitude and distance', 400));
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const distanceNum = parseFloat(distance);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(distanceNum)) {
    return next(new AppError('Invalid latitude, longitude or distance', 400));
  }

  const radius =
    unit === 'mi'
      ? distanceNum / 3963.2
      : distanceNum / 6378.1;

  const nearestStations = await stationLocation.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lngNum, latNum], radius]
      }
    }
  });

 res.status(200).json({
  status: 'success',
  results: nearestStations.length,
  data: {
    nearestStations: nearestStations.map(station => ({
      id: station._id,
      name: station.name,
      line: station.line,
      lat: station.location.coordinates[1],
      lng: station.location.coordinates[0]
    }))
  }
});

});
