const mongoose=require('mongoose');
const subscriptionApprovalSchema=new mongoose.Schema({
  adminId:{
    type:mongoose.Schema.ObjectId,
    ref:'Admin',
    required:true
  },
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  subscriptionId:{
    type:mongoose.Schema.ObjectId,
    ref:'Subscription',
    required:true
  },
  request:{
          type:String,
          enum:['approved','rejected','pending'],
          default:'pending',
          required:[true,'please approve or reject the request']
      }
});
const subscriptionApproval=mongoose.model('subscriptionApprovalSchema',subscriptionApprovalSchema);
module.exports=subscriptionApproval;