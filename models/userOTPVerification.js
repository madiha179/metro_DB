const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    expireAt: {
        type: Date,
        required: true,
        index: {expires: 0}
    }
}, { timestamps: true });

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);
module.exports = UserOTPVerification;

