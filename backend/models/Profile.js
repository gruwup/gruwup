const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    categories: {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model("Profile", schema);