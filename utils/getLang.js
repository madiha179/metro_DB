module.exports=(req)=>{
  const query=req.query.lang;
  const header=req.headers['accept-language']?.split(',')[0]?.split('-')[0];
  return(query||header)==='ar'?'ar':'en';
};