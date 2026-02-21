const express = require("express");
const adminAuthController=require('../controllers/adminAuthConroller');
const adminRoute=express.Router();
adminRoute.post('/login',adminAuthController.adminlogin);
module.exports=adminRoute;