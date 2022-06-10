const express = require("express");
const router = express.Router();

const TestMessage = {
    userId: "10",
    message: "hello",
    date: "2022-04-01",
    time: "8:01"
};

const TestMessageList = {
    pagination: 0,
    messages: [
        TestMessage,
        TestMessage,
        TestMessage
    ]
};


module.exports = router;