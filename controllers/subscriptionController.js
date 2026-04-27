const path = require('path');
const fs = require('fs');
const Station = require("../models/stationModel");
const Subscription = require("../models/subscriptionModel");
const subscriptionType = require("../models/subscriptionsTypesModel");
const AppError = require("../utils/appError");
const subscriptionOffices = require('../models/subscriptionOfficesModel');
const catchAsyncError = require('../utils/catchAsyncError');

const DURATION_MONTHS = {
    monthly:     1,
    quarterly:   3,
    // 'semi-annual': 6,
    yearly:      12,
};

function addMonth(data, months) {
    const d = new Date(data);
    d.setMonth(d.getMonth() + months);
    return d;
}

function cleanupFiles(files = {}) {
    Object.values(files).flat().forEach((f) => {
        fs.unlink(f.path, () => {}); 
    });
}

function safeRegex(str) {
    const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
}

function buildDocumentPaths(files) {
    const uploadsDir = 'uploads';
    return {
        nationalId_front: path.join(uploadsDir, path.basename(files.nationalId_front[0].path)),
        nationalId_back:  path.join(uploadsDir, path.basename(files.nationalId_back[0].path)),
        universityId: files.universityId
            ? path.join(uploadsDir, path.basename(files.universityId[0].path))
            : null,
        militaryId: files.militaryId
            ? path.join(uploadsDir, path.basename(files.militaryId[0].path))
            : null,
    };
}

exports.displaySubPlans = catchAsyncError(async (req, res, next) => {
    const categories = await subscriptionType.distinct('category');

    if (!categories || categories.length === 0)
        return next(new AppError('No categories found.', 404));

    res.status(200).json({
        status: 'success',
        numOfRecords: categories.length,
        data: categories
    });
});

exports.displaySubCategory = catchAsyncError(async (req, res, next) => {
    const type = req.params.category;
    
    const plans = await subscriptionType.aggregate([
        {
            $match: {
                $or: [
                    { 'category.en': type.trim().toLowerCase() },
                    { 'category.ar': type.trim() }
                ]
            }
        },
        {
            $group: {
                _id: {
                    en: "$category.en",
                    ar: "$category.ar"
                },
                category: { $first: "$category" },
                plans: {
                    $push: {
                        _id: "$_id",
                        duration: "$duration",
                        zones: "$zones",
                        price: "$price"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: 1,
                plans: 1
            }
        }
    ]);
    if(!plans || plans.length === 0)
        return next(new AppError('No plans found for this category.', 404));
    
    res.status(200).json({
        status: 'success',
        numOfRecords: plans[0].plans.length,
        data: plans[0]
    });
});

exports.createSubscription = catchAsyncError(async (req, res, next) => {
    const { category, duration, zones, numOfLines, office, start_station, end_station } = req.body;
    const files = req.files || {};

    // 1. National ID is always required
    if (!files.nationalId_front || !files.nationalId_back) {
        cleanupFiles(files);
        return next(new AppError('National ID (front and back) are required.', 400));
    }

    // 2. Required fields check
    if (!category || !duration || (!zones && !numOfLines) || !office || !start_station || !end_station) {
        cleanupFiles(files);
        return next(new AppError('category, duration, zones or numOfLines, office, start_station, and end_station are all required.', 400));
    }

    // 3. Find the matching subscription type
    const subType = await subscriptionType.findOne({
        $or: [
            { 'category.en': category.trim().toLowerCase(), 'duration.en': duration.trim().toLowerCase() },
            { 'category.ar': category.trim(),               'duration.ar': duration.trim() },
        ],
        ...(zones     && { zones: Number(zones) }),
        ...(numOfLines && { numOfLines: Number(numOfLines) }),
    });

    if (!subType) {
        cleanupFiles(files);
        return next(new AppError(`No subscription type found for category "${category}", duration "${duration}".`, 404));
    }

    // 4. Category-specific document validation
    if (subType.category.en === 'students' && !files.universityId) {
        cleanupFiles(files);
        return next(new AppError('University ID is required for student subscriptions.', 400));
    }
    if (subType.category.en === 'military' && !files.militaryId) {
        cleanupFiles(files);
        return next(new AppError('Military ID is required for military subscriptions.', 400));
    }

    // 5. Find the office
    const subOffice = await subscriptionOffices.findOne({
        $or: [
            { 'officeName.en': safeRegex(office.trim()) },
            { 'officeName.ar': safeRegex(office.trim()) },
        ],
    });
    if (!subOffice) {
        cleanupFiles(files);
        return next(new AppError(`No office found matching "${office}".`, 404));
    }

    //////////////////Check if office suport this duration or not//////////////////////

    // 6. Find stations
    const [startStation, endStation] = await Promise.all([
        Station.findOne({ $or: [{ 'name.en': safeRegex(start_station.trim()) }, { 'name.ar': safeRegex(start_station.trim()) }] }),
        Station.findOne({ $or: [{ 'name.en': safeRegex(end_station.trim()) },   { 'name.ar': safeRegex(end_station.trim()) }] }),
    ]);

    if (!startStation) {
        cleanupFiles(files);
        return next(new AppError(`No station found matching "${start_station}".`, 404));
    }
    if (!endStation) {
        cleanupFiles(files);
        return next(new AppError(`No station found matching "${end_station}".`, 404));
    }

    // 7. Prevent duplicate active subscriptions
    const existingActive = await Subscription.findOne({
        user: req.user.id,
        status: { $in: ['active', 'pending'] },
    });
    if (existingActive) {
        cleanupFiles(files);
        return next(new AppError('You already have an active or pending subscription.', 409));
    }

    // 8. Compute dates 
    // const start_date = new Date();
    // const months = DURATION_MONTHS[subType.duration.en] || 1;
    // const end_date = addMonth(start_date, months);

    // 8. Create the subscription
    const sub = await Subscription.create({
        user:           req.user.id,
        type:           subType._id,
        office:         subOffice._id,
        start_station:  startStation._id,
        end_station:    endStation._id,
        status:         'pending',
        documents:      buildDocumentPaths(files),
    });

    await sub.populate([
        { path: 'type',          select: 'category duration zones prices' },
        { path: 'office',        select: 'officeName workingHours address' },
        { path: 'start_station', select: 'name line_number position' },
        { path: 'end_station',   select: 'name line_number position' },
    ]);

    return res.status(201).json({
        success: true,
        data: sub,
    });
});

exports.getMySubscription = catchAsyncError( async (req, res, next) => {
    const sub = await Subscription.findOne({
        user: req.user.id
    }).sort({ createdAt: -1 })
    .populate('type', 'category duration zones prices')
    .populate('office', 'officeName workingHours address')
    .populate('start_station', 'name')
    .populate('end_station', 'name');

    if(!sub)
        return next(new AppError('No subscription found.', 404)); 

    const safe = sub.toObject();
    delete safe.documents;
    
    return res.status(200).json({
        success: true,
        data: safe,
    });
});
