const mongoose = require("mongoose");
const Category = require("./internalUseSchema/Category");
const DateTime = require("./internalUseSchema/DateTime");
const AdventureStatus = require("./internalUseSchema/AdventureStatus");

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
        type: Category,
        required: true
    },
    peopleGoing: [String],
    dateTime: {
        type: DateTime,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: AdventureStatus,
        required: true,
    }
});

module.exports = mongoose.model("Adventure", schema);