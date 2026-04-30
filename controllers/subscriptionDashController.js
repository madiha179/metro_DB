const path = require('path');
const fs = require('fs');
const Subscription = require("../models/subscriptionModel");
const AppError = require("../utils/appError");
const catchAsyncError = require("../utils/catchAsyncError");

VALID_STATUSES = ['active','accepted','expired', 'canceled', 'pending'];
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
    const { status, rejectionReason } = req.body;
    if(!VALID_STATUSES.includes(status)) 
        return next(new AppError('Invalid status value.', 400));

    const sub = await Subscription.findByIdAndUpdate(
        id, 
        { status, rejectionReason },
        { new: true, runValidators: true }
    );

    if(!sub)
        return next( new AppError('Subscription not found.', 404));
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
