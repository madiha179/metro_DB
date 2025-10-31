const mongoose=require('mongoose');
const dotenv=require('dotenv');
const express=require('express');
dotenv.config({path:'config.env'});
const app=express();
app.use(express.json());
const port=process.env.PORT;
const DB=process.env.DATABASE;
mongoose.connect(DB)
.then(() => console.log("✅ DB connection successful"))
  .catch(err => console.error("❌ DB connection error:", err));
app.listen(port,()=>{
    console.log("working on 3000")
});