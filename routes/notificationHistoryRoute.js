const express=require('express');
const notificationsHistoryController=require('../controllers/notificationsHistoryController');
const authController=require('../controllers/authController');
const notificationsHistoryRouter=express.Router();
notificationsHistoryRouter.use(authController.protect);
notificationsHistoryRouter.get('/notification-history',notificationsHistoryController.getNotficationsHistory);
module.exports=notificationsHistoryRouter;