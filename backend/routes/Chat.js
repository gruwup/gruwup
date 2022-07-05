const e = require("express");
const express = require("express");
const AdventureStore = require("../store/AdventureStore");
const Session = require("../services/Session");
const router = express.Router();
const ChatStore = require("../store/ChatStore");
const ChatSocket = require("../services/ChatSocket");

var messageCount = {}

router.post("/:adventureId/send", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var adventureId = req.params.adventureId;
            var userId = req.body.userId;
            var adventure = await AdventureStore.getAdventureDetail(adventureId);
            var participants = adventure['payload']['peopleGoing'];
            var result;

            if (participants.includes(req.body.userId)) {
                var message = {
                    userId: userId,
                    name: req.body.name,
                    message: req.body.message,
                    dateTime: req.body.dateTime
                };

                if (!messageCount[adventureId] || messageCount[adventureId] == 10) messageCount[adventureId] = 0;
                messageCount[adventureId]++;
                ChatSocket.sendMessage(userId, adventureId, message);

                if (messageCount[adventureId] == 1) {
                    result = await ChatStore.storeNewMessageGroup(adventureId, message, req.body.dateTime);
                } else {
                    result = await ChatStore.storeExistingMessageGroup(adventureId, message, req.body.dateTime);
                }
                    
                if (result.code === 200) {
                    res.sendStatus(200);
                }
                else {
                    res.status(result.code).send({ message: result.message.toString() });
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

// allows front-end to obtain the pagination for the most recent chat for an adventure
router.get("/:adventureId/recent-pagination", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await ChatStore.getPrevPagination(req.params.adventureId, Date.now());
            if (result.code === 200) {
                res.status(200).send({ pagination: result.payload });
            }
            else {
                res.status(result.code).send({ message: result.message.toString() });
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
                res.status(result.code).send({ message: result.message.toString() });
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

router.delete("/:adventureId/delete-chat", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await ChatStore.deleteChat(req.params.adventureId);
            if (result.code === 200) {
                res.sendStatus(200);
            }
            else {
                res.status(result.code).send({ message: result.message.toString() });
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

module.exports = router;