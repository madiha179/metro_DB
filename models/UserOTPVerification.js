const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expireAt: Date,
});

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);
module.exports = UserOTPVerification;