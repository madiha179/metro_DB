const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    ssn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'please enter your ssn'],
        unique: [true, 'The Social Security number must be unique'],
    },
    //the number on the card
    id:{
        type: Number,
        require: [true, 'The Subscription ID is required'],
    },
    type: {
        type: String,
        required: [true, 'please enter the type']
    }, 
    status: {
    type: String,
    enum: ['active', 'expired', 'canceled', 'pending'],
    default: 'pending',
    },
    prices: {
        type: Number,
        required: [true, 'please enter the price'],
        min: 0,
    },
    start_station:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required:[true,'The start station is required'],
    },
    end_station:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required:[true,'The end station is required'],
    },
    start_date:{
        type: Date,
    },
    end_date:{
        type: Date,
    },
    created_at:{
        type: Date,
    },
    updated_at:{
        type: Date,
    },
    image:{
        type:String
    },
})

const Subscription = mongoose.model('Subscription', subSchema);
module.exports = Subscription;