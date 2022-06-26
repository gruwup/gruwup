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
        required: true
    }
});

module.exports = mongoose.model("Request", schema);