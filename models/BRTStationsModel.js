const mongoose=require('mongoose');
const BRTStationsSchema=new mongoose.Schema({
  name:{
    en:{type:String,required:true, lowercase: true, trim: true },
    ar:{type: String, required: true, trim: true}
  },
  position: {
        type: Number,
        required: [true, 'Station position/order is required'], 
        min: 1,
    }
});
const BRTStationsModel=mongoose.model('BRTStation',BRTStationsSchema);
module.exports=BRTStationsModel;