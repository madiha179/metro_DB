const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provied Your Name ']
    },
    email:{
        type:String,
        required:[true,'Please provied your email'],
        unique:true,
        lowcase:true,
        validate:[validator.isEmail,'please provied a valid email']
    },
    photo:{
        type:String
    },
    password:{
        type:String,
        required:[true,'please provied password'],
        select:false,
        minlength:8
    },
    confirm_password:{
        type:String,
        required:[true,'please confirm your password'],
        validator:function(el){
            return el===this.password
        },
        message:'passwords are not the same'
    },
    phone:{
        type:Number,
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
});
//Hash password before saving 
UserSchema.pre('save',async function (next){
    if(!this.isModified('password'))  return next();
    this.password=await bcrypt.hash(this.password,12);
    //delete passwordconfirm field
    this.confirm_password=undefined;
    next();
});
// compare passwords
UserSchema.methods.correctPassword=async function (candidatepassword,password) {
    return await bcrypt.compare(candidatepassword,password);}
const User=mongoose.model('user',UserSchema);
module.exports=User;