const mongoose = require("mongoose");

const schema = mongoose.Schema({
    requestId: {
        type: String,
        required: true
    },
    adventureId: {
        type: String,
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "APPROVED", "REJECTED"],
            message: '{VALUE} is not a supported RequestStatus'
        },
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

module.exports = mongoose.model("Request", schema);