const AppError= require('./../utils/appError');
//user enter wrong data
const handleCastErrorDB=err=>{
  //err.path => feild that have a wrong value 
  const message=`Invalid ${err.path}: ${err.value}`;
  return new AppError(message,400);
};
//handle if user enter a data that already exist like enter an email that already store in data
const handleDuplicateFieldsDB =err=>{
  //err.errmsg => message comes from mongodb
  ///(["'])(\\?.)*?\1/ => regular expression try to find the duplicate value in error text
  const value= err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
   const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
// if user enter data not matching the condition which define in schema
const handleValidationErrorDB = err => {
  //convert errors values into array
  const errors = Object.values(err.errors).map(el => el.message);
  //add all errors message in one sentence
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev=(err,res)=>{
res.status(err.codestatus).json({
    status: err.status,
    error:err,
    message: err.message,
    stack:err.stack
  });
}
const sendErrorProd =(err,res)=>{
  //operational send clear error meassage to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    });
  }else{
    //1 log error (to show error details)
    console.error('Error',err);
    //2 send message to client 
    res.status(500).json({
      status:'error',
      message:'something went wrong'
    });
  }
};
module.exports = (err, req, res, next) => {
  err.codestatus = err.codestatus || 500;
  err.status = err.status || 'error';
  if(process.env.NODE_ENV==='development'){
    sendErrorDev(err,res);
  }
  else if(process.env.NODE_ENV==='production'){
    let error = { ...err };
    if(error.name==='CastError') error = handleCastErrorDB(error);
    if(error.code===11000) error = handleDuplicateFieldsDB(error);
    if(error.name==='ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};