const path = require('path');
const fs = require('fs');
const Station = require("../models/stationModel");
const Subscription = require("../models/subscriptionModel");
const subscriptionType = require("../models/subscriptionsTypesModel");
const AppError = require("../utils/appError");
const subscriptionOffices = require('../models/subscriptionOfficesModel');

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

exports.createSubscription = async (req, res) => {
    const { category, duration, zones, numOfLines, office, start_station, end_station } = req.body;
    const files = req.files || {};
    let subType, subOffice, startStation, endStation;
    
    try {
        if (!files.nationalId_front || !files.nationalId_back) {
            cleanupFiles(files);
            return res.status(400).json({
                success: false,
                message: 'National ID (front and back) are required.',
            });
        }

        // console.log('file req: ', req.body);
        if (!category || !duration || (!zones && !numOfLines) || !office || !start_station || !end_station) {
            cleanupFiles(files);
            return res.status(400).json({
                success: false,
                message: 'category, duration, (zones or number of lines), office, start_station, and end_station are all required.',
            });
        }

        subType = await subscriptionType.findOne({
            $or: [
            { 'category.en': category.trim().toLowerCase(), 'duration.en': duration.trim().toLowerCase() },
            { 'category.ar': category.trim(),               'duration.ar': duration.trim() },
            { 'category.en': category.trim().toLowerCase(), 'duration.ar': duration.trim() },
            { 'category.ar': category.trim(),               'duration.en': duration.trim().toLowerCase() },
        ],
            ...(zones && { zones: Number(zones) }),
            ...(numOfLines && { numOfLines: Number(numOfLines) }),
        });

        if(!subType){
            cleanupFiles(files);
            return res.status(404).json({ 
                success: false,
                message: `No subscription type found for category "${category}", duration "${duration}", zones ${zones}.`, 
            });
        }

        // 3. Students must upload their university ID
        if (subType.category.en === 'students' && !file.universityId) {
            cleanupFiles(files);
            return res.status(400).json({
                success: false,
                message: 'University ID is required for student subscriptions.',
            });
        }

        // 4. Validate that the chosen office supports this duration
        subOffice = await subscriptionOffices.findOne({
            $or: [
            { 'officeName.en': safeRegex(office.trim()) },
            { 'officeName.ar': safeRegex(office.trim()) },
        ],
        });
        if (!subOffice) {
            cleanupFiles(files);
            return res.status(404).json({ 
                success: false, 
                message: `No office found matching "${office}".`, 
            });
        }

        startStation = await Station.findOne({
            $or: [
            { 'name.en': safeRegex(start_station.trim()) },
            { 'name.ar': safeRegex(start_station.trim()) },
        ],
        });
        if (!startStation) {
        cleanupFiles(files);
        return res.status(404).json({
            success: false,
            message: `No station found matching "${start_station}".`,
        });
        }

        endStation = await Station.findOne({
            $or: [
            { 'name.en': safeRegex(end_station.trim()) },
            { 'name.ar': safeRegex(end_station.trim()) },
        ],
        });
        if (!endStation) {
        cleanupFiles(files);
        return res.status(404).json({
            success: false,
            message: `No station found matching "${end_station}".`,
        });
        }

        // 5. Prevent duplicate active subscriptions for the same user
        const existingActive = await Subscription.findOne({
            user: req.user.id,
            status: { $in: ['active', 'pending'] },
        });
        if(existingActive) {
            cleanupFiles(files);
            return res.status(409).json({
                success: false,
                message: 'You already have an active subscription.',
            });
        }

        //Compute dates
        const start_date = new Date();
        const months = DURATION_MONTHS[subType.category.en] || 1;
        const end_date = addMonth(start_date, months);
        const uploadsDir = 'uploads';
        const documents ={
            nationalId_front: path.join(uploadsDir, path.basename(files.nationalId_front[0].path)),
            nationalId_back: path.join(uploadsDir, path.basename(files.nationalId_back[0].path)),
            universityId: files.universityId
            ? path.join(uploadsDir, path.basename(files.universityId[0].path))
            : null,
        };

        console.log('user id: ', req.user.id);
        
        const sub = await Subscription.create({
            user: req.user.id,
            type: subType._id,
            office: subOffice._id, 
            start_station: startStation._id,
            end_station: endStation._id,
            priceSnapshot: subType.prices,
            start_date,
            end_date,
            status: 'pending',
            documents,
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
    } catch(error) {
        cleanupFiles(files);
        console.error('createSubscription error:', error);
    return res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
    });
    }
};

exports.getMySubscription = async (req, res) => {
    try{
        const sub = await Subscription.findOne({
            user: req.user.id
        }).sort({ createdAt: -1 })
        .populate('type', 'category duration zones prices')
        .populate('office', 'officeName workingHours address')
        .populate('start_station', 'name')
        .populate('end_station', 'name');

        if(!sub)
            return res.status(404).json({
                success: false,
                message: 'No subscription found.',
            });
            const safe = sub.toObject();
            delete safe.documents;
            return res.status(200).json({
                success: true,
                data: safe,
            });
    }catch(err){
        console.error('getMySubscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}