const mongoose = require("mongoose");

const schema = mongoose.Schema({
    adventureId: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Message", schema);