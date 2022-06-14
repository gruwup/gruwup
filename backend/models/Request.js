const mongoose = require("mongoose");
const DateTime = require("./internalUseSchema/DateTime");
const RequestStatus = require("./internalUseSchema/RequestStatus");

const schema = mongoose.Schema({
    requestId: {
        type: String,
        required: true
    },
    adventureId: {
        type: String,
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    status: {
        type: RequestStatus,
        required: true
    },
    dateTime: {
        type: DateTime,
        required: true
    }
});

module.exports = mongoose.model("Request", schema);