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
        type: String,
        required: true
    },
    messages: {
        type: [
            {
                userId: { type: String, required: true },
                name: { type: String, required: true },
                message: { type: String, required: true },
                dateTime: { type: String, required: true }
            }
        ],
        required: true
    }
});

module.exports = mongoose.model("Message", schema);