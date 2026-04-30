const mongoose=require('mongoose');
const { subscribe } = require('../routes/subscriptionsDashRoute');
const emailHistorySchema=new mongoose.Schema({
  to:{
    type:String,
    required:true
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  subscription:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
  },
  type: {
        type: String,
        enum: [
            'rejection',
            'reminder',
            'renewal_failed',
            'renewed',
            'expired'
        ],
        required: true,
    },
    metadata: {
        rejectionReason: String,  
        amount:          Number,  
        renewalDate:     Date,
    },
     status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent',
    },
},{timestamps:true});
module.exports=mongoose.model('EmailHistory',emailHistorySchema);