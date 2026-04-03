const mongoose=require('mongoose');
const subscriptionOfficesSchema=new mongoose.Schema({
officeName:{
  en: { type: String, required: true, lowercase: true, trim: true },
  ar: { type: String, required: true, trim: true }
},
offersQuarterly:{
  type:Boolean,
  default:false
},
offersYearly:{
  type:Boolean,
  default:false
},
workingHours:{
  from:{
    type:String,
    match:/^([01]\d|2[0-3]):[0-5]\d$/
  },
  to:{
     type:String,
    match:/^([01]\d|2[0-3]):[0-5]\d$/
  }
}
});
const subscriptionOffices=mongoose.model('subscriptionOffices',subscriptionOfficesSchema);
module.exports=subscriptionOffices;