const express = require("express");
const GoogleAuth = require("../services/GoogleAuth");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", (req, res) => {
    GoogleAuth.validateToken(req.body.authentication_code).then(response => {
        var userId = response.payload['sub'];
        var token = Session.createSession(userId);

        try {
            var result = await UserStore.getUserProfile(userId);

            res.cookie(Session.name, token);
            if (result.code === 200) {
                res.status(200).send({userId: userId, userExists: true});
            }
            else if (result.code === 404) {
                res.status(404).send({userId: userId, userExists: false});
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }       
    })
    .catch(err => {
        res.status(404).send({message: err.toString()});
    });
});

router.post("/sign-out", (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        Session.deleteSession(req.headers.cookie);
        res.sendStatus(200);
    }
    else {
        res.status(403).send({message: "Invalid cookie"});
    }
});

module.exports = router;