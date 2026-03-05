module.exports=(req)=>{
    const header=req.headers['accept-language']?.split(',')[0]?.split('-')[0];
  return(header)==='ar'?'ar':'en';
};