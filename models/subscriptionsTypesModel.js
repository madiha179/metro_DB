const mongoose=require('mongoose');
const subscriptionTypeSchema=new mongoose.Schema({
  zones:{
    type:Number,
    required:true
  },
  category:{
    en:{
    type:String,
    enum:["public","students","military","Elderly","special","special needs"],
    required:true,
    trim: true
    },
    ar:{
      type:String,
      enum:["عام","طلاب","الجيش و الشرطه","كبار السن","حالات خاصه(ابناء الشهداء)","ذوي الاحتياجات الخاصه"],
      trim: true
    }
  },
  duration:{
    en:{
    type:String,
    enum:["monthly","quarterly","yearly"],
    required:true
    },
    ar:{
      type:String,
      enum:["شهري","ربع سنوي","سنوي"]
    }
  },
  prices:{
    type:Number,
    required:true
  }
});
const subscriptionType=mongoose.model('subscriptionType',subscriptionTypeSchema);
module.exports=subscriptionType;