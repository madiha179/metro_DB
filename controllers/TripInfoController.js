const catchAsync = require('../utils/catchAsyncError');
const Station = require('./../models/stationModel');
const Ticket = require('./../models/ticketmodel');
const Graph = require("node-dijkstra");
const getLang = require('../utils/getLang');
const userTrips=require('../models/usersTripes');

const DISTANCE = 2; 
const TIME = 3; 

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

exports.getStation = catchAsync(async (req, res, next) => {
    const lang = getLang(req);

    const stationList = await Station.aggregate([
        { $group: { _id:{ name:"$name.en",line:"$line_number"}, doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } },
        {
            $addFields: {
                name: { $ifNull: [`$name.${lang}`, "$name.en"] }
            }
        },
        {$sort:{line_number:1,position:1}}
    ]);

    return res.status(200).json({
        data: stationList
    });
});

exports.tripInfo = catchAsync(async (req, res, next) => {
    const { startStation, endStation } = req.body;
    const lang = getLang(req);

    const startCandidates = await Station.find({
        $or: [{ 'name.en': startStation.toLowerCase() }, { 'name.ar': startStation }]
    });
    const endCandidates = await Station.find({
        $or: [{ 'name.en': endStation.toLowerCase() }, { 'name.ar': endStation }]
    });

    if (startCandidates.length === 0 || endCandidates.length === 0) {
        return res.status(400).json({ message: "Invalid station name" });
    }

    let start, end;

    const sameLinePairs = [];
    for (const s of startCandidates) {
        for (const e of endCandidates) {
            if (s.line_number === e.line_number) {
                sameLinePairs.push({ s, e, dist: Math.abs(s.position - e.position) });
            }
        }
    }

    if (sameLinePairs.length > 0) {
        sameLinePairs.sort((a, b) => b.dist - a.dist);
        start = sameLinePairs[0].s;
        end = sameLinePairs[0].e;
    } else {
        start = startCandidates[0];
        end = endCandidates[0];
    }

    let stationList = [];
    let count;

    if (start.line_number === end.line_number) {
        const min = Math.min(start.position, end.position);
        const max = Math.max(start.position, end.position);
        const listStation = await Station.find({
            line_number: start.line_number,
            position: { $gte: min, $lte: max }
        }).sort("position");
        count = Math.abs(min - max) + 1;
        stationList = [...listStation];
        if (start.position > end.position)
            stationList.reverse();
    } else {
        const firstTransfer = await Station.find({
            is_transfer: true,
            line_number: start.line_number,
            transfer_to: { $elemMatch: { line: end.line_number } }
        }).sort("position");

        if (firstTransfer.length === 0)
            return res.status(400).json({
                message: "No transfer station found between these lines"
            });

        const list = new Map();
        const metroGraph = new Graph();

        for (let t of firstTransfer) {
            const min1 = Math.min(start.position, t.position);
            const max1 = Math.max(start.position, t.position);

            const testStation = await Station.find({
                line_number: start.line_number,
                position: { $gte: min1, $lte: max1 }
            }).sort("position");

            for (let j = 0; j < testStation.length; j++) {
                const current = testStation[j];
                list.set(current.name.en, current);
                const neighbors = {};
                if (j > 0) neighbors[testStation[j - 1].name.en] = 1;
                if (j < testStation.length - 1) neighbors[testStation[j + 1].name.en] = 1;
                pushNode(metroGraph, current.name.en, neighbors);
            }

            const transferInfo = t.transfer_to.find(obj => obj.line == end.line_number);
            if (transferInfo) {
                const transferStationOnLine2 = await Station.findOne({
                    line_number: end.line_number,
                    position: transferInfo.position
                });
                if (transferStationOnLine2) {
                    pushNode(metroGraph, t.name.en, { [transferStationOnLine2.name.en]: 1 });
                    pushNode(metroGraph, transferStationOnLine2.name.en, { [t.name.en]: 1 });
                    list.set(transferStationOnLine2.name.en, transferStationOnLine2);
                }
            }
        }

        const secondTransfer = firstTransfer
            .map(t => t.transfer_to.find(obj => obj.line == end.line_number))
            .filter(Boolean);

        for (let t of secondTransfer) {
            const min2 = Math.min(end.position, t.position);
            const max2 = Math.max(end.position, t.position);

            const secondList = await Station.find({
                line_number: end.line_number,
                position: { $gte: min2, $lte: max2 }
            }).sort("position");

            for (let j = 0; j < secondList.length; j++) {
                const current = secondList[j];
                list.set(current.name.en, current);
                const neighbors = {};
                if (j > 0) neighbors[secondList[j - 1].name.en] = 1;
                if (j < secondList.length - 1) neighbors[secondList[j + 1].name.en] = 1;
                pushNode(metroGraph, current.name.en, neighbors);
            }
        }

        const path = metroGraph.path(start.name.en, end.name.en, { cost: true });

        if (!path || !path.path) {
            return res.status(400).json({
                message: "No route found between these stations"
            });
        }

        const ArrayList = [...list.values()];
        const result = ArrayList.filter((obj) => path.path.includes(obj.name.en));

        const firstList = [];
        const secondList = [];
        result.forEach(obj => {
            if (obj.line_number === start.line_number)
                firstList.push(obj);
            else
                secondList.push(obj);
        });

        if (firstList.length === 0 || secondList.length === 0) {
            return res.status(400).json({
                message: "No route found between these stations"
            });
        }

        firstList.sort((a, b) => a.position - b.position);
        secondList.sort((a, b) => a.position - b.position);

        if (firstList[0].name.en !== start.name.en)
            firstList.reverse();

        if (secondList.at(-1).name.en !== end.name.en)
            secondList.reverse();

        stationList = [...firstList, ...secondList];
        count = path.cost + 1;
    }

    const formattedStations = stationList.map(station => ({
        ...station.toObject(),
        name: station.name[lang] || station.name.en
    }));

    const ticket = await Ticket.findOne({ no_of_stations: { $gte: count } }).sort({ no_of_stations: 1 });
    const ticketPrice = ticket ? ticket.price : 0;
    const distance = count * DISTANCE;
    const time = count * TIME;
    
        const userTrip = await userTrips.create({
        userId: req.user.id,
        trip_history: [{
            fromStation: {
                en: stationList[0].name.en,
                ar: stationList[0].name.ar
            },
            toStation: {
                en: stationList[stationList.length - 1].name.en,
                ar: stationList[stationList.length - 1].name.ar
            },
            ticketId:  ticket?._id,
            trip_date: new Date()
        }]
    });
    res.status(200).json({
        tripId: userTrip._id,
        stations: formattedStations,
        count,
        distance,
        time,
        ticketPrice
    });
});