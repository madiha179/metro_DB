const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
const cookieParser=require('cookie-parser');
const apperr = require('./utils/appError.js');
const globalError=require('./controllers/errorController.js');
const swaggerDocs=require('./swagger/swaggerDoc.js');
const userRouter=require('./routes/userRoute');
const TripRouter = require('./routes/TripInfoRoute.js');
const ticketRouter=require('./routes/ticketRoute.js');
const ticketPayRouter=require('./routes/ticketPayRoute.js');
const { createDefaultAdmin } = require('./models/adminmodel.js');
dotenv.config({path:'config.env'});
const app=express();
app.use(express.json());
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
app.use(cookieParser());
swaggerDocs(app);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/trips',TripRouter);
app.use('/api/v1/tickets',ticketRouter);
app.use('/api/v1/ticketpay',ticketPayRouter);
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