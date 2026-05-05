const admin=require('firebase-admin');
const User=require('../models/usermodel');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});

if(!admin.app.length){
  admin.initializeApp({
    credential:admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FCM_CLIENT_EMAIL
    })
  })
}


const pushNotifications=async(userId,title,message)=>{
  try{
     const user = await User.findById(userId).select('fcmToken');
    
    if (!user || !user.fcmToken) {
      console.log('No FCM token found for user');
      return;
    }
 const payLoad={
  notification:{
    title:title,
    body:message
  },
  token:user.fcmToken
 };
 const response=await admin.messaging().send(payLoad);
 console.log('Successfully sent message:',response);
}
catch(err){
  console.error('Error sending message:', err);
}
};
module.exports=pushNotifications;