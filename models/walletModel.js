const mongoose=require('mongoose');
const User = require('./usermodel');
const walletSchema=new mongoose.Schema({
  userId:{
    type: mongoose.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  },
  balance:{
    type:Number,
    min:0,
    default:0
  },
  currency:{
    type:String,
    uppercase: true,
    default:'EGP'
  },
  transactions:[{
    type:{
      type:String,
      enum:['topup','purchase','refund'],
      required:true
    },
    amount:{
      type:Number,
      required:true
    },
    description:String,
    date:{
      type:Date,
      default:Date.now()
    },
    status:{
      type:String,
      enum:['completed','pending','failed'],
      default:'pending'
    }
  }]
});
const wallet=mongoose.model('Wallet',walletSchema);
module.exports=wallet;