const mongoose = require("mongoose");

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
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Request", schema);