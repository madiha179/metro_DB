const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  role:{
    type:String,
    enum:["user","assistant"]
  },
  text:String,
  createdAt:{
    type:Date,
    default:Date.now
  }
});
const chatHistory=mongoose.model('chatHistory',messageSchema);
module.exports=chatHistory;
