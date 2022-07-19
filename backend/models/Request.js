const mongoose = require("mongoose");

const schema = mongoose.Schema({
    adventureId: {
        type: String,
        required: true
    },
    adventureOwner: {
        type: String,
        required: true
    },
    adventureTitle: {
        type: String,
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
    status: {
        type: String,
        enum: {
            values: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
            message: '{VALUE} is not a supported RequestStatus'
        },
        required: true
    },
    dateTime: {
        type: Number,
        required: true
    },
    adventureExpireAt: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Request", schema);