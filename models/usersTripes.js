const mongoose = require('mongoose');
const usersTripsSchema=new mongoose.Schema({
  userId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required:true
    },
    trip_history:[{
    fromStation:{
      en: { type: String, lowercase: true, trim: true },
      ar: { type: String, trim: true },
    },
    toStation:{
      en: { type: String, lowercase: true, trim: true },
      ar: { type: String, trim: true },
    },
    ticketId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Ticket'
    },
    totalPrice:{
      type:Number
    },
    trip_date:{
      type:Date,
      default:Date.now
    },
    payment_method:{
      type:String,
      enum:['visa card','aman']
    }
  }]
});
const userTrips=mongoose.model('UserTrips',usersTripsSchema);
module.exports=userTrips;