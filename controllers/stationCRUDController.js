const stataions = require('./../models/stationModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const appError = require('./../utils/appError');
const ApiFeatures = require('./../utils/ApiFeatures');
const AppError = require('./../utils/appError');

const formatStation = (station) => ({
    _id: station._id,
    name: station.name?.en || station.name,
    line_number: station.line_number,
    position: station.position,
    is_transfer: station.is_transfer,
    transfer_to: station.transfer_to,
    __v: station.__v
});

exports.addStation = catchAsyncError(async (req, res, next) => {
    const { stationName, lineNumber, position, isTransfer, transferTo } = req.body;
    const exists=await stataions.findOne({line_number:lineNumber,position:position});
    if(exists){
        return next(new AppError('A station already exists at this position on this line',400));
    }
    const newStation = await stataions.create({
        name: { en: stationName },
        line_number: lineNumber,
        position: position,
        is_transfer: isTransfer,
        transfer_to: transferTo
    });
    if(isTransfer&&transferTo&&transferTo.length>0){
        for(const transfer of transferTo){
            await stataions.findOneAndUpdate({
                line_number:transfer.line,
                position:transfer.position
            },
            {
                $push:{
                    transfer_to:{
                        line:lineNumber,
                        position:position
                    }
                },
                $set:{
                    is_transfer:true
                }
            }
        )
        }
    }
    res.status(201).json({
        status: 'success',
        data: {
            station: formatStation(newStation)
        }
    });
});

exports.getAllStations = catchAsyncError(async (req, res, next) => {
    if (!req.query.sort) {
        req.query.sort = 'line_number,position';
    }
    if (!req.query.limit) {
        req.query.limit = '10';
    }
    const numOfStations = await stataions.find();
    const data = new ApiFeatures(stataions.find(), req.query)
        .sort().paginate();
    const allStations = await data.query;
    if (allStations.length === 0 && numOfStations.length > 0) {
        return next(new appError('No more stations, you have exceeded the available pages', 404));
    }
    if (numOfStations.length === 0) {
        return next(new appError('No Stations To Show', 404));
    }
    res.status(200).json({
        status: 'success',
        stationsTotalLength: numOfStations.length,
        results: allStations.length,
        data: {
            allStations: allStations.map(formatStation)
        }
    });
});

exports.getStation = catchAsyncError(async (req, res, next) => {
    const station = await stataions.findById(req.params.id);
    if (!station)
        return next(new appError('Station Not Found', 404));
    res.status(200).json({
        status: 'success',
        data: {
            station: formatStation(station)
        }
    });
});

exports.updateStation = catchAsyncError(async (req, res, next) => {
    const updateData = { ...req.body };
    if (req.body.stationName) {
        updateData['name.en'] = req.body.stationName;
        delete updateData.stationName;
    }
    const station = await stataions.findByIdAndUpdate(req.params.id, { $set: updateData }, {
        new: true,
        runValidators: true
    });
    if (!station)
        return next(new appError('Station Not Found To Update', 404));
    res.status(200).json({
        status: 'success',
        data: {
            station: formatStation(station)
        }
    });
});

exports.deleteStation = catchAsyncError(async (req, res, next) => {
    const station = await stataions.findByIdAndDelete(req.params.id);
    if (!station)
        return next(new appError('Station Not Found To Delete', 404));
    res.status(204).json({
        status: 'success',
        message: 'Station deleted successfully'
    });
});

exports.searchStation = catchAsyncError(async (req, res, next) => {
    if (!req.query.sort) {
        req.query.sort = 'line_number,position';
    }
    const data = new ApiFeatures(stataions.find({
        "$or": [
            { "name.en": { $regex: req.params.key, $options: 'i' } },
            { "name.ar": { $regex: req.params.key, $options: 'i' } }
        ]
    }), req.query).sort();
    const station = await data.query;
    if (!station || station.length === 0)
        return next(new appError('Station Not Found', 404));
    res.status(200).json({
        status: 'success',
        data: {
            station: station.map(formatStation)
        }
    });
});