const catchAsync = require('../utils/catchAsyncError');
const Station = require('./../models/stationModel');
const Ticket = require('./../models/ticketmodel');
const Graph = require("node-dijkstra");

const DISTANCE = 2; 
const TIME =  3; 

function pushNode(graph, nodeName, newNeighbors) {
    const existingNode = graph.graph.get(nodeName);
    if (existingNode) {
        for (const [k, v] of Object.entries(newNeighbors)) {
            existingNode.set(k, v);
        }
    } else {
        graph.addNode(nodeName, newNeighbors);
    }
}

function sortArray(arr, firstList, secondList, startState){
    const temp = new Map(arr.map(obj => ([obj.name, obj])));
    temp.sort()
    temp.forEach((value, key) => {
        if(value.line_number === startState.line_number)
            firstList.push(value);
        else
            secondList.push(value);
    });
}

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
        const firstTransfer = await Station.find({
            is_transfer: true,
            line_number: start.line_number,
            transfer_to: {$elemMatch: {line: end.line_number}}
        }).sort("position");

        if (firstTransfer.length === 0) 
            return res.status(400).json({ 
                message: "No transfer station found between these lines"
            });

        const list = new Map();
        const metroGraph  = new Graph();
        for(let t of firstTransfer){
            const min1 = Math.min(start.position, t.position);
            const max1 = Math.max(start.position, t.position);

            const testStation = await Station.find({
                line_number: start.line_number, 
                position: {$gte: min1, $lte: max1}
            }).sort("position");
            
            for(let j = 0; j < testStation.length; j++){
                const current = testStation[j];
                list.set(current.name, current);
                const neighbors = {};
                if(j > 0) neighbors[testStation[j - 1].name] = 1;
                if(j < testStation.length - 1) neighbors[testStation[j + 1].name] = 1;
                pushNode(metroGraph, current.name, neighbors);
            }
        }

        const secondTransfer = firstTransfer
        .map(t => t.transfer_to.find(obj => obj.line == end.line_number))
        .filter(Boolean);

        for(let t of secondTransfer){
            const min2 = Math.min(end.position, t.position);
            const max2 = Math.max(end.position, t.position);

            const secondList = await Station.find({
                line_number: end.line_number
                ,position: {$gte: min2, $lte: max2}
            }).sort("position");

            for(let j = 0; j < secondList.length; j++){
                const current = secondList[j];
                list.set(current.name, current);
                const neighbors = {};
                if(j > 0) neighbors[secondList[j - 1].name] = 1;
                if(j < secondList.length - 1) neighbors[secondList[j + 1].name] = 1;
                pushNode(metroGraph, current.name, neighbors);
            }
        }
        const path = metroGraph.path(start.name, end.name, {cost: true});
        const ArrayList = [...list.values()];
        const result =ArrayList.filter((obj) => path.path.includes(obj.name));
        console.log("result 2: ", result);

        const firstList = [];
        const secondList = [];
        result.forEach(obj => {
            if(obj.line_number === start.line_number)
                firstList.push(obj);
            else
                secondList.push(obj);
        });
        firstList.sort((a, b) => a.position - b.position);
        secondList.sort((a, b) => a.position - b.position);

        if(firstList[0].name !== start.name)
            firstList.reverse();
        
        if(secondList.at(-1).name !== end.name)
            secondList.reverse();
        
        stationList = [...firstList, ...secondList];
        console.log("stationList: ", stationList);
        
        count = path.cost + 1; 
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
