const mongoose = require("mongoose");

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
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Message", schema);