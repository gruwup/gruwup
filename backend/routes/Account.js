const express = require("express");
const GoogleAuth = require("../services/GoogleAuth");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", async (req, res) => {
    try {
        var response = await GoogleAuth.validateToken(req.body.authentication_code);
        var userId = response.payload['sub'];
        var token = Session.createSession(userId);
        var result = await UserStore.getUserProfile(userId);
        
        res.cookie(Session.name, token);
        if (result.code === 200) {
            return res.status(200).send({ userId, userExists: true });
        }
        else if (result.code === 404) {
            return res.status(404).send({ userId, userExists: false });
        }
    }
    catch (err) {
        res.status(400).send({ message: err.toString() });
    }    
});

router.post("/sign-out", (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        Session.deleteSession(req.headers.cookie);
        return res.sendStatus(200);
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;