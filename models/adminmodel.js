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
     const createAdmin=  async ()=>{
        try{
         const adminExists = await Admin.findOne({ email: "admin@gmail.com" });
          if (!adminExists) {
            const admin = new Admin({
                ssn: 2875642015314,
                name: "System Administrator",
                password: "Admin$12345", 
                gender: "male",
                email: "admin@gmail.com",
                request:'pending'
            });
            await admin.save();}
    }
    catch (error) {
        console.error('Error creating admin:', error);
    }
}
setTimeout(async () => {
    try {
        await createAdmin();
    } catch (error) {
        console.log('retry admin creation');
        setTimeout(async () => {
            await createAdmin();
        }, 5000);
    }
}, 3000);
 module.exports = { Admin };