const catchAsync = require('../utils/catchAsyncError');
const Station = require('./../models/stationModel');
const Ticket = require('./../models/ticketmodel');

const DISTANCE = 2; 
const TIME =  3; 

exports.getStation = catchAsync( async (req, res, next) => {
    const stationList = await Station.aggregate([
    { $group: { _id: "$name", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } }
]);
    return res.status(200).json({
        data: stationList
    });
});

exports.tripInfo = catchAsync(async (req, res, next) => {
    const {startStation, endStation} = req.body;
    const start = await Station.findOne({name: startStation.toLowerCase()});
    const end = await Station.findOne({name: endStation.toLowerCase()});
    
    if(!start || !end){
        return res.status(400).json({
            message: "Invalid station name"
        });
    }

    let stationList = [];
    let count;
    
    if(start.line_number === end.line_number){
        const min = Math.min(start.position, end.position);
        const max = Math.max(start.position, end.position);
        const listStation = await Station.find({
            line_number: start.line_number,
            position: {$gte: min, $lte: max}
        }).sort("position");
        count = Math.abs(min - max) + 1;
        stationList = [...listStation];
    }
    else {
        const transfer = await Station.findOne({
            is_transfer: true,
            line_number: start.line_number,
            transfer_to: {$elemMatch: {line: end.line_number}}
        });
        if (!transfer) 
        return res.status(400).json({ 
            message: "No transfer station found between these lines"
        });
        const min1 = Math.min(start.position, transfer.position);
        const max1 = Math.max(start.position, transfer.position);
        const firstList = await Station.find({
            line_number: start.line_number, 
            position: {
                $gte: min1,
                $lte: max1
            }
        }).sort("position");
        const transferTarget = transfer.transfer_to.find(obj => obj.line == end.line_number);
        const min2 = Math.min(end.position, transferTarget.position);
        const max2 = Math.max(end.position, transferTarget.position);
        const secondList = await Station.find({
            line_number: end.line_number
            ,position: {
                $gte: min2,
                $lte: max2
            }
        }).sort("position");
        count = 
        Math.abs(transfer.position - start.position) + 
        Math.abs(end.position - transferTarget.position) + 1; 
        stationList = [...firstList, ...secondList];
    }
    
    const ticket = await Ticket.findOne({ no_of_stations: { $gte: count } }).sort({ no_of_stations: 1 });
    const ticketPrice = ticket ? ticket.price : 0;
    const distance = count * DISTANCE;
    const time = count * TIME;
    res.status(200).json({
        stations: stationList,
        count,
        distance,
        time,
        ticketPrice
    });
});
