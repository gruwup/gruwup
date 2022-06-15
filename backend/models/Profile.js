const mongoose = require("mongoose");
const Category = require("./internalUseSchema/Category");

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
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("Profile", schema);