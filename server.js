const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
const apperr = require('./utils/appError.js');
const swaggerDocs=require('./swagger/swaggerDoc.js')
const userRouter=require('./routes/userRoute')
dotenv.config({path:'config.env'});
const app=express();
app.use(express.json());
const port = process.env.PORT|| 3000;
const DB=process.env.DATABASE;
mongoose.connect(DB,{
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ DB connection successful"))
  .catch(err => console.error("❌ DB connection error:", err));
  swaggerDocs(app);
  app.use('/api/v1/users',userRouter);
  app.all('*', (req, res, next) => {
  next(new apperr(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.listen(port,()=>{
    console.log(`Server running on PORT: ${port}`);
});