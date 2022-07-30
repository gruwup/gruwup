const express = require("express");
const GoogleAuth = require("../services/GoogleAuth");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", async (req, res) => {
    return await GoogleAuth.validateToken(req.body.authentication_code, req.body.client_id).then(async response => {
        var userId = response.payload['sub'];
        var token = Session.createSession(userId);
        return await UserStore.getUserProfile(userId).then(result => {
            res.cookie(Session.name, token);
            if (result.code === 200) {
                return res.status(200).send({ userId, userExists: true });
            }
            else if (result.code === 404) {
                return res.status(404).send({ userId, userExists: false });
            }
            return res.status(500).send({ message: result.message });
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }, err => {
        void err;
        return res.status(400).send({ message: "Bad request" });
    });
});

router.post("/sign-out", (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        Session.deleteSession(req.headers.cookie);
        return res.sendStatus(200);
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;