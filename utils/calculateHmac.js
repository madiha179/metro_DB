const crypto=require('crypto');
exports.calculateHmac=(secretkey,data)=>{
  return crypto
  //Hash-based Message Authentication Code using 512 hashing algo 
  .createHmac('sha512',secretkey)
  .update(data)
  .digest('hex');
};