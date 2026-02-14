const mongoose = require('mongoose');
usersTripsSchema=new mongoose.Schema({
  userId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required:true
    },
    ticketId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Ticket',
      required:true
    },
    totalPrice:{
      type:Number
    }
});
const userTrips=mongoose.model('UserTrips',usersTripsSchema);
module.exports=userTrips;