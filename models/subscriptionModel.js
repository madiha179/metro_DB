const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptionType',
        required: true,
    }, 
    status: {
    type: String,
    enum: ['active', 'expired', 'rejected', 'pending'],
    default: 'pending',
    },
    //it may change
    priceSnapshot: {
        type: Number,
        required: true,
    },
    start_station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required:[true,'The start station is required'],
    },
    end_station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required:[true,'The end station is required'],
    },
    office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptionOffices',
        required: true
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    documents: {
        nationalId_front: {
            type: String,
            required: [true, 'National ID (front) is required'],
        },
        nationalId_back: {
            type: String,
            required: [true, 'National ID (back) is required'],
        },
        universityId: {
            // Only required for student category — enforced at the controller level
            type: String,
            default: null,
        },
    },
}, { timestamps: true });

subSchema.index({ user: 1, status: 1 });
subSchema.index({ end_date: 1, status: 1 });

module.exports =  mongoose.model('Subscription', subSchema);