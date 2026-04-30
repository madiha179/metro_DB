const mongoose=require('mongoose');
const ticketBRTSchema=new mongoose.Schema({
  noOfStations:{
    type:Number,
    required:true
  },
  price:{
    type:Number,
    required:true
  }
});
const ticketBRTModel=mongoose.model('ticketBRT',ticketBRTSchema);
module.exports=ticketBRTModel;