const mongoose = require("mongoose");

const Category = mongoose.Schema({
    categoryType: {
        type: String,
        enum: {
            values: ["MOVIE", "MUSIC", "SPORTS", "FOOD", "TRAVEL", "DANCE", "ART"],
            message: '{VALUE} is not supported'
        }
    }
}
);

module.exports = Category;