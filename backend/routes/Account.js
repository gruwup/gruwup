const express = require("express");
const UserAccount = require("../services/UserAccount");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", (req, res) => {
    UserAccount.checkValidToken(req.body.authentication_code).then(response => {
        var userId = response.payload['sub'];
        var token = Session.createSession(userId);
        UserStore.findUser(userId).then((user, err) => {
            res.cookie(Session.name, token);
            if (err) {
                res.status(500).send({message: err.toString()});
            }
            else if (!user) {
                res.status(404).send({userId: userId, userExists: false});
            }
            else {
                res.status(200).send({userId: userId, userExists: true});
            } 
        });
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