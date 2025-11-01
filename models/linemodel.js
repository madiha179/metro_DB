const mongoose=require('mongoose');
const { isLowercase } = require('validator');
const LineSchema=new mongoose.Schema({
    name:{
        type: String, 
        required:[true,'The line name is required'],
        lowercase: true
    },
    line_number: {
        type: Number,
        required:[true,'The line number is required'],
    },
    start_station:{
        type: Number,
        required:[true,'The start station is required'],
    },
    end_station:{
        type: Number,
        required:[true,'The end station is required'],
    },
    station_description: {
        type: String,
        required:[true,'The station description is required'],
    }
})