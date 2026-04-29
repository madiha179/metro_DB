const mongoose=require('mongoose');
const subscriptionPaymentSchema=new mongoose.Schema({
userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User',
  required:true
},
subscriptionId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'Subscription'
},
card_token:{
  type:String,
  default:null
},
masked_pan:{
type:String,
  default:null
},
card_subtype:{
  type:String,
  default:null
},
   payment_history:[{
        issuing_date:{
        type:Date,
        required:true
    }
    ,paying_date:{
        type:Date,
    },
    expire_date:{
       type:Date 
    },
    amount_paid:{
        type:Number,
        default:0,
        min:0
    },
    payment_method:{
        type:String,
        enum:['visa card','cash'],
        default:'visa card',
        required: true
    },
    invoice_number:{
        type:Number
    },
    payment_status:{
         type: String,
         enum:['pending','paid','partial','failed'],
          default: 'pending'
    }
    }]
},
{
  timestamps:true
}
);
subscriptionPaymentSchema.index({subscriptionId:1});
subscriptionPaymentSchema.index({card_token:1});
subscriptionPaymentSchema.index({"payment_history.invoice_number":1});
const subscriptionPayment=mongoose.model('subscriptionPayment',subscriptionPaymentSchema);
module.exports=subscriptionPayment;