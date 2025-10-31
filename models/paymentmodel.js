const mongoose=require('mongoose');
const PaymentSchema=new mongoose.Schema({
    issuing_date:{
        type:Date
    }
    ,paying_date:{
        type:Date,
    },
    expire_date:{
       type:Date 
    },
    payment_history:[{
        
    }]
});
const payment=mongoose.model('payment',PaymentSchema);
module.exports=payment;