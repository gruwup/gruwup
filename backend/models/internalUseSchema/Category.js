const mongoose = require("mongoose");

const Category = mongoose.Schema({
    value: {
        type: String,
        enum: {
            value: ["MOVIE", "MUSIC", "SPORTS", "FOOD", "TRAVEL", "DANCE", "ART"],
            message: '{VALUE} is not a supported category'
        }
    }
});

module.exports = Category;