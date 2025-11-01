const mongoose = require('mongoose');
const { type } = require('os');
subSchema = new mongoose.Schema({
    ssn: {
        type: Number,
        required: [true, 'please enter your ssn']
    },
    type: {
        type: String,
        required: [true, 'please enter the type']
    }, 
    prices: {
        type: Number,
        required: [true, 'please....']
    },
    image:{
        type:String
    },
})

const Subscription = mongoose.model('Subscription', subSchema);
module.exports = Subscription;