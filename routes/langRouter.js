const express=require('express');
const authController=require('../controllers/authController');
const langController=require('../controllers/languageController');
const langRouter=express.Router();
langRouter.use(authController.protect);
langRouter.patch('/language',langController.updatePreferredLang);
module.exports=langRouter;