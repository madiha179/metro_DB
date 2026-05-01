const path = require('path');
const fs = require('fs');
const Subscription = require("../models/subscriptionModel");
const user =require('../models/usermodel');
const AppError = require("../utils/appError");
const catchAsyncError = require("../utils/catchAsyncError");
const emailHistoryModel=require('../models/emailHistoryModel');
const Email =require('../utils/sendEmail');
const ApiFeatures=require('../utils/ApiFeatures');
VALID_STATUSES = ['active','accepted','expired', 'rejected', 'pending'];
const VALID_DOC_TYPES = ['nationalId_front', 'nationalId_back', 'universityId', 'militaryId'];

exports.getAllSubscriptions = catchAsyncError(async (req, res, next) => {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const subscriptions = await Subscription.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('user',          'name email phone')
    .populate('type',          'category.en duration.en zones')
    .populate('office',        'officeName.en')
    .populate('start_station', 'name.en')
    .populate('end_station',   'name.en')
    .sort({ createdAt: -1 });

    const total = await Subscription.countDocuments(filter);

    return res.status(200).json({
    success: true,
    total,
    page:  Number(page),
    pages: Math.ceil(total / limit),
    data:  subscriptions,
    });
});

exports.getPendingSubscriptions = catchAsyncError(async (req, res, next) => {

    const allStatuses = await Subscription.find({}, 'status').lean();

    const filter = { status: 'pending' };
    const subscriptions = await Subscription.find(filter)
        .populate('user', 'name email phone')
        .populate('type', 'category.en duration.en zones')
        .populate('office', 'officeName.en')
        .populate('start_station', 'name.en')
        .populate('end_station', 'name.en');

    return res.status(200).json({
        success: true,
        total: subscriptions.length,
        data: subscriptions,
    });
});

exports.updateSubStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { status , rejectionReason} = req.body;
    if(!VALID_STATUSES.includes(status)) 
        return next(new AppError('Invalid status value.', 400));
    if(status==='rejected'&&!rejectionReason){
         return next(new AppError('Rejection reason is required when rejecting a subscription.', 400));
    }
    const updateData={status};
    if(status==='rejected') updateData.rejectionReason=rejectionReason;
    const sub = await Subscription.findByIdAndUpdate(
        id, 
        updateData,
        { new: true, runValidators: true }
    ).populate('user','name email');

    if(!sub)
        return next( new AppError('Subscription not found.', 404));
    if(status==='rejected'&&sub.user?.email){
        try{
        await new Email(
            sub.user,
            null,null,null,null,null,rejectionReason
        ).sendSubscriptionRejectReason();
        await emailHistoryModel.create({
            to:sub.user.email,
            user:sub.user._id,
            subscription:sub._id,
            type:'rejection',
            metadata:{rejectionReason},
            status:'sent',
        });
    }
catch(err){
    await emailHistoryModel.create({
            to:           sub.user.email,
            user:         sub.user._id,
            subscription: sub._id,
            type:         'rejection',
            metadata:     { rejectionReason },
            status:       'failed',
        });
}
    }
    return res.status(200).json({
        success: true,
        data: sub
    });
});

exports.getSubDoc = catchAsyncError(async (req, res, next) => {
    const { id, docType } = req.params;

    if(! VALID_DOC_TYPES.includes(docType))
        return next(new AppError('Invalid document type.', 400));

    const sub = await Subscription.findById(id);
    if(!sub) 
        return next(new AppError('Subscription not found.' , 404));
    const relativePath = sub.documents[docType];
    if (!relativePath) 
        return next(new AppError('Document not found.', 404));
    const uploadsRoot = path.resolve(__dirname, '..', 'uploads');
    const filePath    = path.resolve(__dirname, '..', relativePath);
    
        if (!filePath.startsWith(uploadsRoot)) 
        return next(new AppError('Access denied.', 403));

        if (!fs.existsSync(filePath)) 
        return next(new AppError('File not found on server.', 404));
    
    return res.sendFile(filePath);
});
exports.getAllMails=catchAsyncError(async(req,res,next)=>{
const mails=await emailHistoryModel.find();
if(!mails||mails.length===0){
    return next(new AppError('Mails not found',404))
}
res.status(200).json({
    status:'success',
    data:{
        emailHistory:mails
    }
});
});
exports.searchSubscription=catchAsyncError(async(req,res,next)=>{
    const {name,status}=req.query;
    let userFilter={};
    if(name){
        const users=await user.find({
            name:{$regex:name,$options:'i'}
        }).select('_id');
        //console.log('Users found:', users);
        userFilter.user={$in:users.map(u=>u._id)};
    }
if (status) userFilter.status = { $regex: status, $options: 'i' };
    //console.log('userFilter:', userFilter);
    const data=new ApiFeatures(
        Subscription.find(userFilter)
        .populate('user', 'name email')
        .populate('type', 'category.en duration.en zones prices')
        .populate('office', 'officeName.en '),
        req.query
    ).sort();
    const subscriptions=await data.query;
    if (!subscriptions || subscriptions.length === 0)
    return next(new AppError('Subscription not found', 404));
    res.status(200).json({
        status:'success',
        results: subscriptions.length,
        data:{subscriptions}
    });
});