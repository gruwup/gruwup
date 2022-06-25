const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        validate: {
            validator: function (value) {
                var val = new Date(Number(value));
                var now = new Date();
                return val > now;
            },
            message: '{VALUE} dateTime cannot be in the past'
        },
        required: true
    }
});

module.exports = mongoose.model("Message", schema);