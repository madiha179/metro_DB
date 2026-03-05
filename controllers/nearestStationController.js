const CatchAsync = require('../utils/catchAsyncError')
const AppError = require('../utils/appError');
const stationLocation = require('../models/stationsLocation');
const getLang=require('../utils/getLang')
exports.getSatationWithIn = CatchAsync(async (req, res, next) => {
  const { lat, lng } = req.params;
  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude', 400));
  }
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return next(new AppError('Invalid latitude or longitude', 400));
  }
  const nearestStation = await stationLocation.findOne({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lngNum, latNum]
        }
      }
    }
  });

  if (!nearestStation) {
    return next(new AppError('No station found', 404));
  }
const lang=getLang(req);
  res.status(200).json({
    status: 'success',
    data: {
      nearestStation: {
        id: nearestStation._id,
 name: nearestStation.name[lang] || nearestStation.name.en,
         line: nearestStation.line,
        lat: nearestStation.location.coordinates[1],
        lng: nearestStation.location.coordinates[0]
      }
    }
  });
});