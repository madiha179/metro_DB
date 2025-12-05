const {validationResult}=require('express-validator');
const validateRequest=(req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
  return res.status(400).json({
    success:false,
    message:"validation error",
    details:errors.array()
  });
}
next();
};
module.exports=validateRequest;