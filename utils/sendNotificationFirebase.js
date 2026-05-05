const admin=require('firebase-admin');
const User=require('../models/usermodel');
const serviceAccount = require("../notficatons-firebase-adminsdk-fbsvc-88780ad8c4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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