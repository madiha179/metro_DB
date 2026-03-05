module.exports=(req)=>{
  const query=req.query.lang;
  const header=req.header['accept-language']?.split(',')[0]?.split('-')[0];
  return(query||header)==='ar'?'ar':'en';
};