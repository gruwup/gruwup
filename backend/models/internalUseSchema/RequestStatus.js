const mongoose = require("mongoose");

const RequestStatus = mongoose.Schema({
    value: {
        type: String,
        enum: {
            value: ["PENDING", "APPROVED", "REJECTED"],
            message: '{VALUE} is not a supported RequestStatus'
        }
    }
});

module.exports = RequestStatus;