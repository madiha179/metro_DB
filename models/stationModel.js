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
    is_transfer: {
        type: Boolean,
        default: false
    },
    transfer_to:[
        {
            line:{type: Number},
            position: {type: Number}
        }
    ],
});

const Station = mongoose.model('Station', stationSchema);
module.exports = Station;
