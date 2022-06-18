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
                return /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/.test(value);
            },
            message: '{VALUE} is not a valid date time of format yyyy-mm-dd hh:mm:ss'
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
    }
});

module.exports = mongoose.model("Adventure", schema);