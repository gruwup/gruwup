const express = require("express");
const router = express.Router();

const Constants = require("../constants/Constants");

const TestMessage = {
    "userId": "string",
    "message": "hi everyone :)",
    "dateTime": "yyyy-mm-dd hh:mm:ss"
  };

const TestMessageList = {
    pagination: 0,
    messages: [
        TestMessage,
        TestMessage,
        TestMessage
    ]
};

// test endpoint
router.get("/", (req, res) => {
    res.send("Chat route live");
});

// sending a message
router.post("/:adventureId/send", (req, res) => {
    console.log(req.params.adventureId);
    res.status(200).send(TestMessage);
});

// getting a message list
router.get("/:adventureId/messages/:pagination", (req, res) => {
    console.log("adventureId: " + req.params.adventureId);
    console.log("pagination: " + req.params.pagination);
    console.log("pagination limit: " + Constants.CHAT_PAGINATION_LIMIT);
    res.status(200).send(TestMessageList);
});

router.delete("/:adventureId/delete-chat", async (req, res) => {
    res.sendStatus(200).send();
});

module.exports = router;