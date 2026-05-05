const cron=require('node-cron');
const axios=require('axios');
const subscriptionModel=require('../models/subscriptionModel');
const subscriptionPayment=require('../models/subscriptionPaymentModel');
const Users=require('../models/usermodel');
const Email=require('./sendEmail');
const emailHistoryModel=require('../models/emailHistoryModel');
const pushNotification=require('./sendNotificationFirebase');
const notificationHistory=require('./../models/notificationsHistoryModel');
const dotenv=require('dotenv');
const MailMessage = require('nodemailer/lib/mailer/mail-message');
dotenv.config({path:'./config.env'});
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const PAYMOB_SUB_API_KEY = process.env.PAYMOB_SUB_API_KEY;
const PAYMOB_SUB_IFRAME_ID = process.env.PAYMOB_SUB_IFRAME_ID;
const integrationId = Number(process.env.PAYMOB_CARD_SUB_INTEGRATION_ID);

const Duration_Months={
  'monthly':1,
  'quarterly':3,
  'half yearly':6,
  'yearly':12,
};

function addMonths(date,months){
  const d=new Date(date);
  d.setMonth(d.getMonth()+months);
  return d;
}
// helper function for send ar or en notifications
function getNotificationMessages(lang, data = {}) {
  const messages = {
    reminder: {
      title: { ar: 'تذكير بانتهاء الاشتراك', en: 'Subscription Expire Date Reminder' },
      message: {
        ar: `اشتراكك سينتهي خلال 7 أيام. تأكد من وجود رصيد كافٍ ${data.price} جنيه في حسابك للتجديد التلقائي.`,
        en: `Your subscription will expire within 7 days. Please ensure you have enough balance ${data.price} in your account for auto-renewal.`
      }
    },
    manual_renewal: {
      title: { ar: 'مطلوب تجديد يدوي', en: 'Action Required: Renew Your Subscription' },
      message: {
        ar: 'اشتراكك سينتهي قريباً. يرجى التجديد يدوياً لعدم وجود بطاقة محفوظة.',
        en: 'Your subscription expires soon. Please renew manually as no saved card was found.'
      }
    },
    renewed: {
      title: { ar: 'تم تجديد الاشتراك بنجاح', en: 'Subscription Successfully Renewed' },
      message: {
        ar: `تم تجديد اشتراكك تلقائياً. تاريخ الانتهاء القادم: ${data.expireDate}`,
        en: `Your subscription has been automatically renewed. next expire date ${data.expireDate}`
      }
    },
    renewal_failed: {
      title: { ar: 'فشل تجديد الاشتراك', en: 'Subscription Renewal Failed' },
      message: {
        ar: 'فشل تجديد اشتراكك تلقائياً. يرجى التجديد يدوياً.',
        en: 'Your subscription automatic renewal failed. Please renew manually.'
      }
    },
    expired: {
      title: { ar: 'انتهى الاشتراك', en: 'Subscription Expired' },
      message: {
        ar: `انتهى اشتراكك بتاريخ ${data.expireDate}`,
        en: `Your subscription has expired on ${data.expireDate}`
      }
    }
  };

  const t = messages[data.type];
  return {
    title: t.title[lang] || t.title.en,
    message: t.message[lang] || t.message.en
  };
}
//helper functions for payment //
async function getAuthToken() {
  const res = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
    api_key: PAYMOB_SUB_API_KEY
  });
  return res.data.token;
}

async function createOrder(authToken, amountCents) {
  const res = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
    auth_token: authToken,
    amount_cents: amountCents,
    delivery_needed: false,
    currency: "EGP",
    items: [{
      name: "Metro Subscription Renewal",
      amount_cents: amountCents,
      description: "Auto Renewal",
      quantity: 1
    }]
  });
  return res.data.id;
}

async function createPaymentKey(authToken,orderId,user,subscriptionPrice) {
  const [firstName,...rest]=user.name.split(' ');
  const lastName=rest.join(' ')||'NA';
  const response=await axios.post(`${PAYMOB_API_URL}/acceptance/payment_keys`,{
    auth_token:authToken,
    amount_cents:subscriptionPrice*100,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone_number: user.phone,
      apartment: "NA",
      floor: "NA",
      building: "NA",
      street: "NA",
      city: "Cairo",
      state: "NA",
      country: "EG"
    },
    currency: "EGP",
    integration_id: integrationId
  });
  return response.data.token;
}
//renew operations//
async function chargeWithToken(paymobKey,cardToken) {
  const response=await axios.post(`${PAYMOB_API_URL}/acceptance/payments/pay`,{
    source:{
      identifier:cardToken,
      subtype:"TOKEN"
    },
    payment_token:paymobKey
  });
  return response.data;
}

//job1 => send email  before 7 days of exp-date => every day at 8am//
cron.schedule('* 8 * * *',async()=>{
  try{
    const now=new Date();
    const in7Dayes=new Date(Date.now()+7*24*60*60*1000);
    const expiringString=await subscriptionModel
    .find({status:'active',end_date:{$gte:now,$lte:in7Dayes},reminderSentAt:null})
    .populate('type','prices duration category')
    .populate('user','name email preferredLanguage');
    for(const sub of expiringString){
      try{
        await new Email(sub.user,null,sub.type.prices,null,sub.end_date,null).sendSubscriptionReminder();
        await subscriptionModel.findByIdAndUpdate(sub._id,{
          $set:{reminderSentAt:new Date()}
        });
        const lang=sub.user?.preferredLanguage||'en';
       const {title, message}=getNotificationMessages(lang,{type:'reminder',price:sub.type.prices});
        await pushNotification(sub.user._id,title,message);
        await notificationHistory.create({userId:sub.user._id,title:title,message:message,sendAt:new Date()});
        await emailHistoryModel.create({
           to:sub.user.email,
            user:sub.user._id,
            subscription:sub._id,
            type:'reminder',
            status:'sent',
        })
      }
      catch(err){
        console.error(` Failed to send reminder to ${sub.user.email}:`, err.message);
        if(!sub.user?.email) continue;
        await emailHistoryModel.create({
            to:           sub.user.email,
            user:         sub.user._id,
            subscription: sub._id,
            type:         'reminder',
            status:       'failed',
        });
      }
    }
  }
  catch(err)
  {
    console.log('7-day reminder job error:',err.message);
  }
});

//job2 => send email renew and payment every hour //
cron.schedule('0 * * * *',async()=>{
  try{
    const now=new Date();
    const in2Days=new Date(Date.now()+2*24*60*60*1000);
    const expiringString=await subscriptionModel
    .find({status:'active',end_date:{$gte:now,$lte:in2Days},renewalInitiatedAt:null})
    .populate('type','prices duration')
    .populate('user','name email phone preferredLanguage');
    for(const sub of expiringString){
      try{
        const paymentRecord=await subscriptionPayment.findOne({
          subscriptionId:sub._id,
          card_token:{$ne:null}
        }).sort({createdAt: -1}); 
        // if user not save card 
        if(!paymentRecord?.card_token){
           console.log(` No card token for subscription ${sub._id}`);
           // change subscription status 
        await subscriptionModel.findByIdAndUpdate(sub._id,{
          $set:{
            status:'pending',
            renewalInitiatedAt:new Date()
          }
        });
        try{
          // send email
          await new Email(sub.user,null,sub.type.prices,null,sub.end_date,null)
          .sendManualRenewalRequired();
          await emailHistoryModel.create({
            to:sub.user.email,
            user:sub.user._id,
            subscription:sub._id,
            type: 'manual_renewal_required',
            status:'sent'
          });
        }
        catch(emailErr){
    console.error(`Failed to send manual renewal email:`, emailErr.message);
    await emailHistoryModel.create({
      to: sub.user.email,
      user: sub.user._id,
      subscription: sub._id,
      type: 'manual_renewal_required',
      status: 'failed',
    });
        }
        // push notification 
   const lang = sub.user?.preferredLanguage || 'en';
const { title, message } = getNotificationMessages(lang, { type: 'manual_renewal' });
  await pushNotification(sub.user._id, title, message);
  await notificationHistory.create({
    userId: sub.user._id,
    title,
    message,
    sendAt:new Date()
  });

  continue;
      }
        const user=sub.user;
        if(!user||!user.email){
          console.log(`user or email not found for subscription ${sub._id}`);
          continue;
        }
        const amountCents=sub.type.prices*100;
        //renew payment
        const authToken=await getAuthToken();
        const orderId=await createOrder(authToken,amountCents);
        const paymobKey=await createPaymentKey(authToken,orderId,user,sub.type.prices);
        const result=await chargeWithToken(paymobKey,paymentRecord.card_token);
        //update payment history 
        if(result.success){
          await subscriptionPayment.findByIdAndUpdate(paymentRecord._id,{
            $push:{
              payment_history:{
                issuing_date: new Date(),
                expire_date: new Date(Date.now() + 60 * 60 * 1000),
                invoice_number: orderId,
                amount_paid: sub.type.prices,
                payment_method: 'visa card',
                payment_status: 'active'
              }
            }
          });
          // update subscription status and end date 
          const durationEn = sub.type?.duration?.en?.toLowerCase();
          const months = Duration_Months[durationEn] || 1;
          const newEndDate = addMonths(new Date(), months);
          await subscriptionModel.findByIdAndUpdate(sub._id,{
            $set:{renewalInitiatedAt:new Date(),
              end_date:newEndDate,
              status:'active',
              reminderSentAt:null
            }
          });
          // send renew email
          const renewalDate=new Date().toLocaleDateString('en-GB');
          const expireDate = newEndDate.toLocaleDateString('en-GB');
          await new Email(user,null,sub.type.prices,renewalDate,expireDate,paymentRecord.masked_pan||'xxxx-xxxx-xxxx-xxxx')
          .sendSubscriptionRenewed();
           await emailHistoryModel.create({
                      to:sub.user.email,
                      user:sub.user._id,
                      subscription:sub._id,
                      type:'renewed',
                      metadata:{amount:sub.type.prices},
                      status:'sent',
                  });
                  //send renew notification
                  const lang = sub.user?.preferredLanguage || 'en';
                  const { title, message } = getNotificationMessages(lang, { type: 'renewed', expireDate });
                  await pushNotification(sub.user._id, title, message);
                  await notificationHistory.create({ userId: sub.user._id, title, message, sendAt: new Date() });
        }
        else{
          throw new Error('Charge failed');
        }
      }
    catch(err){
      console.error(` Renewal failed for ${sub._id}:`, err.message);
      await subscriptionModel.findByIdAndUpdate(sub._id,{
        $set:{status:'pending'}
      });
      const user=sub.user;
      if(!user||!user.email){
        console.error(`Cannot send failure email: user or email missing for sub ${sub._id}`);
          continue;
      }
      // email if renew failed
        try {
            await new Email(user, null, null, null, null, null).sendRenewalFailed();
            await emailHistoryModel.create({  
                to:           user.email,
                user:         user._id,
                subscription: sub._id,
                type:         'renewal_failed',
                status:       'sent',
            });
          } catch (emailErr) {
            console.error(` Failed to send failure email:`, emailErr.message);
             await emailHistoryModel.create({       
                to:           user.email,
                user:         user._id,
                subscription: sub._id,
                type:         'renewal_failed',
                status:       'failed',
            });
          }
    }
    }
  }
   catch(err)
  {
    console.log('Renewal job error:',err.message);
  }
});

//expire date subscriptions every day at 9am//

cron.schedule('0 9 * * *',async()=>{
  try{
    const expiredSubs = await subscriptionModel
      .find({ status: 'active', end_date: { $lt: new Date() } })
      .populate('user', 'name email preferredLanguage');
   await subscriptionModel.updateMany(
      {status:'active',end_date:{$lt:new Date()}},
      {$set:{status:'expired'}}
    );
    for(const sub of expiredSubs){
      try{
                const lang = sub.user?.preferredLanguage || 'en';
                const expireDate = sub.end_date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
                await new Email(sub.user, null, null, null, expireDate, null).sendSubscriptionExpired();
                await emailHistoryModel.create({
                    to:sub.user.email,
                    user:sub.user._id,
                    subscription:sub._id,
                    type:'expired',
                    status:'sent',
                });
                const { title, message } = getNotificationMessages(lang, { type: 'expired', expireDate });
                await pushNotification(sub.user._id, title, message);
                await notificationHistory.create({ userId: sub.user._id, title, message, sendAt: new Date() });
      }
      catch(err){
        console.error(` Failed to send expiry email to ${sub.user.email}:`, err.message);
      }
    }
  }
  catch(err){
     console.error(' Expiry check error:', err.message);
  }
})