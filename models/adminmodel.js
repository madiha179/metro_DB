const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const AdminSchema=new mongoose.Schema({
    ssn:{
        type:Number,
        required:[true,'please provied your ssn'],
    },
    name:{
        type:String,
        required:[true,'please provied your name']
    },
    password:{
        type:String,
        required:[true,'please confirm your password'],
        select:false,
        minlength:8
    },
    email:{
            type:String,
            required:[true,'Please provied your email'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'please provied a valid email']
        },
    gender:{
        type:String
    },
    image:{
        type:String
    },
    request:{
        type:String,
        enum:['approved','rejected','pending'],
        default:'pending',
        required:[true,'please approve or reject the request']
    }
});
AdminSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
});
AdminSchema.methods.correctpassword=async function (candidatepassword,password) {
    return await bcrypt.compare(candidatepassword,password);}
    const Admin=mongoose.model('admin',AdminSchema);
  const createAdmin=new Admin({
    ssn:28730125615274,
    name:'Joe',
    password:'Admin$123',
    request:'pending'
  })
  createAdmin.save().then(docs=>{
    console.log(docs)
  }).catch(err=>{console.log("ERORR",err)})
 module.exports = { Admin };