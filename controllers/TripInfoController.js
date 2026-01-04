const catchAsync = require('../utils/catchAsyncError');
const Station = require('./../models/stationModel');
const Ticket = require('./../models/ticketmodel');
const Graph = require("node-dijkstra");

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
        if(start.position > end.position)
            stationList.reverse();
    }
    else {
        const transfer = await Station.find({
            is_transfer: true,
            line_number: start.line_number,
            transfer_to: {$elemMatch: {line: end.line_number}}
        }).sort("position");

        console.log(transfer);

        if (transfer.length === 0) 
            return res.status(400).json({ 
                message: "No transfer station found between these lines"
            });

            ////////////////from here there are addNode is not a function////////////////////
        const metroGraph  = new Graph();
        for(let i = 0; i < transfer.length; i++){
            t = transfer[i];
            const min1 = Math.min(start.position, t.position);
            const max1 = Math.max(start.position, t.position);

            const firstList = await Station.find({
                line_number: start.line_number, 
                position: {$gte: min1, $lte: max1}
            }).sort("position");
            
            if(start.position > transfer.position)
                firstList.reverse();
            
            for(let j = 0; j < firstList.length; j++){
                const current = firstList[j].name;
                const neighbors = {};
                if(j > 0) neighbors[firstList[j - 1].name] = 1;
                if(j < firstList.length - 1) neighbors[firstList[j + 1].name] = 1;
                metroGraph.addNode(current, neighbors);
            }
        console.log('current:', current, 'neighbors:', neighbors);
        }
        // const path = metroGraph.path(start.name, 'endStation');
        // console.log(path);
        ///////////////////end///////////////////

        const transferTarget = transfer.transfer_to.find(obj => obj.line == end.line_number);
        const min2 = Math.min(end.position, transferTarget.position);
        const max2 = Math.max(end.position, transferTarget.position);
        const secondList = await Station.find({
            line_number: end.line_number
            ,position: {$gte: min2, $lte: max2}
        }).sort("position");

        if(transferTarget.position < end.position)
            secondList.reverse();

        count = 
        Math.abs(transfer.position - start.position) + 
        Math.abs(end.position - transferTarget.position) + 1; 
        const result = [...firstList, ...(secondList.reverse())];

        const removeRep = new Map(result.map(s => ([s.name, s])));
        stationList = [...removeRep.values()];

        if (stationList[0].name !== start.name) {
            stationList.reverse();
        }
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