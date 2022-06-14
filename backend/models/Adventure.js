const mongoose = require("mongoose");

const schema = mongoose.Schema({
    adventureId: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: Number,
        required: true
    },
    peopleGoing: [String],
    dateTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Adventure", schema);