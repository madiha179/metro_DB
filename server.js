const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
const cookieParser=require('cookie-parser');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const {xss}=require('express-xss-sanitizer');
const apperr = require('./utils/appError.js');
const globalError=require('./controllers/errorController.js');
const swaggerDocs=require('./swagger/swaggerDoc.js');
const userRouter=require('./routes/userRoute');
const TripRouter = require('./routes/TripInfoRoute.js');
const ticketRouter=require('./routes/ticketRoute.js');
const ticketPayRouter=require('./routes/ticketPayRoute.js');
const callbackRouter=require('./routes/paymentCallbackRoute.js');
const { createDefaultAdmin } = require('./models/adminmodel.js');
const nearestStationRoute=require('./routes/nearsetStationRoute.js');
dotenv.config({path:'config.env'});
const app=express();
app.set('trust proxy', 1);
//security http headers
app.use(helmet());
//app.use(express.json());
app.use(cookieParser());
app.use(
  '/api/v1/paymob-callback',
  express.raw({ type: 'application/json' }),
  callbackRouter
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
//for NO SQL injection
app.use(mongoSanitize());
//for prevent xss injection it`s clean request(body||params||headers||query)from malicous code 
app.use(xss());
const port = process.env.PORT|| 3000;
const DB=process.env.DATABASE;
mongoose.connect(DB,{
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log("✅ DB connection successful");
  await createDefaultAdmin();
})
.catch(err => console.error("❌ DB connection error:", err));
const limiter=rateLimit({
  max:500,
  windowMs:60*60*1000,
  message:"Too Many Requests from this IP , Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
});
const paymentLimiter=rateLimit({
  max:50,
  windowMs:60*60*1000,
  message:"Too many payment requests, Please try again in an hour!",
  statusCode:429,
  standardHeaders: true,
   legacyHeaders: false
});
swaggerDocs(app);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/trips',limiter,TripRouter);
app.use('/api/v1/tickets',limiter,ticketRouter);
app.use('/api/v1/ticketpay',paymentLimiter,ticketPayRouter);
app.use('/api/v1/neareststation',nearestStationRoute);
app.all('*', (req, res, next) => {
  next(new apperr(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
app.use(globalError);
app.listen(port,()=>{
    console.log(`Server running on PORT: ${port}`);
});