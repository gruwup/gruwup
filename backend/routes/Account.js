const express = require("express");
const UserAccount = require("../services/UserAccount");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", (req, res) => {
    UserAccount.checkValidToken(req.body.authentication_code).then(response => {
        //create cookie and send it back to user
        UserStore.findUser(response.payload['sub']).then((user, err) => {
            if (err) {
                res.status(500).send({message: err.toString()});
            }
            else if (!user) {
                res.status(404).send({userId: response.payload['sub'], userExists: false});
            }
            else {
                res.status(200).send({userId: response.payload['sub'], userExists: true});
            } 
        });
    })
    .catch(err => {
        res.status(404).send({message: err});
    });
});

router.post("/sign-out", (req, res) => { //change
    res.sendStatus(200);
});

module.exports = router;