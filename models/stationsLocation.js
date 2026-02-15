const mongoose = require('mongoose');

const stationLocationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  }
});
stationLocationSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('StationLocation', stationLocationSchema);
