const mongoose = require("mongoose");

const schema = mongoose.Schema({
    adventureId: {
        type: String,
        required: true
    },
    adventureParticipants: {
        type: [String],
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    requesterId: {
        type: String,
        required: true
    },
    accepted: {
        type: [String],
    },
    rejected: {
        type: [String],
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