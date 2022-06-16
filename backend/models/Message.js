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
    dareTime: {
        type: String,
        validate: {
            validator: function (value) {
                return /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/.test(value);
            },
            message: '{VALUE} is not a valid date time of format yyyy-mm-dd hh:mm:ss'
        },
        required: true,
    }
});

module.exports = mongoose.model("Message", schema);