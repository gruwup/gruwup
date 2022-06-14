const mongoose = require("mongoose");
const DateTime = require("./internalUseSchema/DateTime");

const schema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dareTime: {
        type: DateTime,
        required: true,
    }
});

module.exports = mongoose.model("Message", schema);