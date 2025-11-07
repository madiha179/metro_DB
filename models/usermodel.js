const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const UserSchema=new mongoose.Schema({
    ssn:{
        type:Number
    },
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
    password: {
  type: String,
  required: [true, 'Please provide a password'],
  minlength: [8, 'Password must be at least 8 characters long'],
  validate: {
    validator: function (value) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
    },
    message:
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.'
  },
  select: false
},
    confirm_password:{
        type:String,
        required:[true,'please confirm your password'],
        validate: {
  validator: function(el) {
    return el === this.password;
  },
  message: 'Passwords are not the same'
}
    },
    phone:{
        type:String,
        validate: {
  validator: function(v) {
    return /^[0-9]{11}$/.test(v);
  },
  message: props => `${props.value} is not a valid phone number!`
}   
},
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum: ['male', 'female']
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
const User=mongoose.model('User',UserSchema);
module.exports=User;