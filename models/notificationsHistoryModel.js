const mongoose=require('mongoose');
const notificationsHistorySchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  sendAt:{
    type:Date,
    required:true
  }
});
const notificationsHistoryModel=mongoose.model('notificationsHistory',notificationsHistorySchema);
module.exports=notificationsHistoryModel;