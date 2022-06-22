const mongoose = require("mongoose");

const schema = mongoose.Schema({
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
        type: String,
        enum: {
            values: ["MOVIE", "MUSIC", "SPORTS", "FOOD", "TRAVEL", "DANCE", "ART"],
            message: '{VALUE} is not supported'
        },
        required: true
    },
    peopleGoing: [String],
    dateTime: {
        type: String,
        validate: {
            validator: function (value) {
                var val = new Date(value);
                var now = new Date();
                return val > now;
            },
            message: '{VALUE} is not a valid date time of format yyyy-mm-dd hh:mm:ss and cannot be in the past'
        },
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["OPEN", "CLOSED", "CANCELLED"],
            message: '{VALUE} is not a supported AdventureStatus'
        },
        required: true,
    },
    image: {
        type: Buffer
    },
    city: {
        type: String
    }
});

module.exports = mongoose.model("Adventure", schema);