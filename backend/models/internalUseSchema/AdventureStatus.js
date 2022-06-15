const mongoose = require("mongoose");

const AdventureStatus = mongoose.Schema({
    value: {
        type: String,
        enum: {
            values: ["OPEN", "CLOSED", "CANCELLED"],
            message: '{VALUE} is not a supported AdventureStatus'
        }
    }
});

module.exports = AdventureStatus;