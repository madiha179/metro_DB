const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
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
    gender:{
        type:String
    },
    image:{
        type:String
    },
    request:{
        type:String,
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
    module.exports=Admin;