const mongoose = require("mongoose");

const schema = mongoose.Schema({
    adventureId: {
        type: String,
        required: true
    },
    pagination: {
        type: String,
        required: true
    },
    prevPagination: {
        type: String
    },
    messages: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("Message", schema);