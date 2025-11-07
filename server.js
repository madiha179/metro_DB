const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
const swaggerDocs=require('./swagger/swaggerDoc.js')
const userRouter=require('./routes/userRoute')
dotenv.config({path:'config.env'});
const app=express();
app.use(express.json());
const port = process.env.PORT|| 3000;
const DB=process.env.DATABASE;
mongoose.connect(DB,{
   useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ DB connection successful"))
  .catch(err => console.error("❌ DB connection error:", err));
  swaggerDocs(app);
  app.use('/api/v1/users',userRouter);
app.listen(port,()=>{
    console.log("working on 3000")
});