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
        type: [
            {
                type: String,
                enum: {
                    values: ["MOVIE", "MUSIC", "SPORTS", "FOOD", "TRAVEL", "DANCE", "ART"],
                    message: '{VALUE} is not supported'
                }
            }
        ],
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("Profile", schema);