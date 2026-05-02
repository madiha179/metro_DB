const cron=require('node-cron');
const axios=require('axios');
const subscriptionModel=require('../models/subscriptionModel');
const subscriptionPayment=require('../models/subscriptionPaymentModel');
const Users=require('../models/usermodel');
const Email=require('./sendEmail');
const emailHistoryModel=require('../models/emailHistoryModel');
const dotenv=require('dotenv');
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
    .populate('user','name email');
    for(const sub of expiringString){
      try{
        await new Email(sub.user,null,sub.type.prices,null,sub.end_date,null).sendSubscriptionReminder();
        await subscriptionModel.findByIdAndUpdate(sub._id,{
          $set:{reminderSentAt:new Date()}
        });
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
    .populate('user','name email phone');
    for(const sub of expiringString){
      try{
        const paymentRecord=await subscriptionPayment.findOne({
          subscriptionId:sub._id,
          card_token:{$ne:null}
        }).sort({createdAt: -1});
        if(!paymentRecord?.card_token){
           console.log(` No card token for subscription ${sub._id}`);
           continue;
        }
        const user=sub.user;
        if(!user||!user.email){
          console.log(`user or email not found for subscription ${sub._id}`);
          continue;
        }
        const amountCents=sub.type.prices*100;
        //payment
        const authToken=await getAuthToken();
        const orderId=await createOrder(authToken,amountCents);
        const paymobKey=await createPaymentKey(authToken,orderId,user,sub.type.prices);
        const result=await chargeWithToken(paymobKey,paymentRecord.card_token);
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
      .populate('user', 'name email');
   await subscriptionModel.updateMany(
      {status:'active',end_date:{$lt:new Date()}},
      {$set:{status:'expired'}}
    );
    for(const sub of expiredSubs){
      try{
        const expireDate=sub.end_date.toLocaleDateString('en-GB');
        await new Email(
          sub.user,
          null,
          null,
          null,
          expireDate,
          null
        ).sendSubscriptionExpired();
        await emailHistoryModel.create({
                    to:sub.user.email,
                    user:sub.user._id,
                    subscription:sub._id,
                    type:'expired',
                    status:'sent',
                });
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