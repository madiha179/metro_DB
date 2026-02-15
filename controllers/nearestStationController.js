const CatchAsync = require('../utils/catchAsyncError')
const AppError = require('../utils/appError');
const stationLocation = require('../models/stationsLocation');
exports.getSatationWithIn = CatchAsync(async (req, res, next) => {
  const { distance, lat, lng, unit } = req.params;
  if (!lat || !lng || !distance) {
    return next(new AppError('Please provide latitude, longitude and distance', 400));
  }
  
  if (unit !== 'km' && unit !== 'mi') {
    return next(new AppError('Unit must be km or mi', 400));
  }
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const distanceNum = parseFloat(distance);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(distanceNum)) {
    return next(new AppError('Invalid latitude, longitude or distance', 400));
  }
  const distanceInMeters = unit === 'mi' ? distanceNum * 1609.34 : distanceNum * 1000;

  const nearestStation = await stationLocation.findOne({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lngNum, latNum]
        },
      }
    }
  });

  if (!nearestStation) {
    return next(new AppError('No station found within the specified distance', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      nearestStation: {
        id: nearestStation._id,
        name: nearestStation.name,
        line: nearestStation.line,
        lat: nearestStation.location.coordinates[1],
        lng: nearestStation.location.coordinates[0]
      }
    }
  });
});