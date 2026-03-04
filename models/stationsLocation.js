const mongoose = require('mongoose');

const stationLocationSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, lowercase: true, trim: true },
    ar: { type: String, required: true, trim: true },
},
  line:{
    type:Number,
     required:true
  },
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
