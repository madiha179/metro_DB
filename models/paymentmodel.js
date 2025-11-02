const mongoose=require('mongoose');
const PaymentSchema=new mongoose.Schema({
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
        enum:['visa card','fawry'],
        required: true
    },
    invoice_number:{
        type:Number
    },
    payment_status:{
         type: String,
         enum:['pending','paid','partial'],
          default: 'pending'
    }
    }]
});
const Payment=mongoose.model('Payment',PaymentSchema);
module.exports=Payment;