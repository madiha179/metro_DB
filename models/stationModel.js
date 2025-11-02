const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'The station name is required'],
        lowercase: true,
        trim: true,
    },
    line_number:{
        type: Number,
        required: [true, 'Each station must belong to a line number'],
    },
    position: {
        type: Number,
        required: [true, 'Station position/order is required'], 
        min: 1,
    },
});

const Station = mongoose.Model('station', stationSchema);
module.exports = Station;
