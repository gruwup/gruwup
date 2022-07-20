const express = require("express");
const Session = require("../services/Session");
const router = express.Router();
const ChatStore = require("../store/ChatStore");
const TestMode = require("../TestMode");
const ChatService = require("../services/ChatService");

router.post("/:adventureId/send", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var message = {
            userId: req.body.userId,
            name: req.body.name,
            message: req.body.message,
            dateTime: req.body.dateTime
        };
        return await ChatService.sendMessage(req.params.adventureId, message).then(result => {
            if (result.code === 200) {
                return res.sendStatus(200);
            }
            return res.status(result.code).send({ message: result.message.toString() });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});


router.get("/:userId/recent-list", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await ChatService.getRecentMessages(req.params.userId).then(result => {
            if (result.code === 200) {
                return res.status(200).send({ messages: result.payload });
            }
            return res.status(result.code).send({ message: result.message.toString() });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

// allows front-end to obtain the pagination for the most recent chat for an adventure
router.get("/:adventureId/recent-pagination", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await ChatStore.getPrevPagination(req.params.adventureId, Date.now()).then(result => {
            if (result.code === 200) {
                return res.status(200).send({ pagination: result.payload });
            }
            return res.status(result.code).send({ message: result.message.toString() });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

// getting a message list
router.get("/:adventureId/messages/:pagination", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await ChatStore.getMessages(req.params.adventureId, req.params.pagination).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            return res.status(result.code).send({ message: result.message.toString() });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

router.delete("/:adventureId/delete-chat", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await ChatStore.deleteChat(req.params.adventureId).then(result => {
            if (result.code === 200) {
                return res.sendStatus(200);
            }
            return res.status(result.code).send({ message: result.message.toString() });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;