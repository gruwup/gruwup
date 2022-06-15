const mongoose = require("mongoose");

const RequestStatus = mongoose.Schema({
    value: {
        type: String,
        enum: {
            values: ["PENDING", "APPROVED", "REJECTED"],
            message: '{VALUE} is not a supported RequestStatus'
        }
    }
}
);

module.exports = RequestStatus;