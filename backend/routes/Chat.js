const e = require("express");
const express = require("express");
const AdventureStore = require("../store/AdventureStore");
const Session = require("../services/Session");
const router = express.Router();
const ChatStore = require("../store/ChatStore");

const TestMessage = {
    "userId": "string",
    "name": "Big Brain Billy Bob",
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

var messages = {}
// sending a message
router.post("/:adventureId/send", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var adventureId = req.params.adventureId;
            var participants = await AdventureStore.getAdventureDetail(adventureId).participants;
            if (participants.includes(req.body.userId)) {
                var message = {
                    userId: req.body.userId,
                    name: req.body.name,
                    message: req.body.message,
                    dateTime: req.body.dateTime
                };
                messages[adventureId].push(message);
                if (messages[adventureId].size() == 10) {
                    var result = await ChatStore.storeMessages(adventureId, messages[adventureId], req.body.dateTime);
                    if (result.code === 200) {
                        res.sendStatus(200);
                    }
                    else {
                        res.status(result.code).send(result.message);
                    }
                }
                else {
                    res.sendStatus(200);
                }
            }
            else {
                res.status(403).send({ message: "User not a participant of adventure" });
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

router.get("/:adventureId/recentTime", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await ChatStore.getPrevDateTime(req.params.adventureId, Date.now());
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

// getting a message list
router.get("/:adventureId/messages/:pagination", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await ChatStore.getMessages(req.params.adventureId, req.params.pagination);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

// removing user from chat
router.delete("/:adventureId/:userId/delete-user", async (req, res) => {
    console.log("adventureId: " + req.params.adventureId);
    console.log("userId: " + req.params.userId);
    res.status(200).send();
});

// removing user from chat
router.delete("/:adventureId/delete-chat", async (req, res) => {
    console.log("adventureId: " + req.params.adventureId);
    res.status(200).send();
});

module.exports = router;