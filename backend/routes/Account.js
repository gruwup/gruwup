const express = require("express");
const DataValidator = require("../constants/DataValidator");
const GoogleAuth = require("../services/GoogleAuth");
const router = express.Router();

router.post("/sign-in", (req, res) => {
    GoogleAuth.validateToken(req.body.authentication_code).then(response => {
        Profile.findById(response.payload['sub'], (err, user) => {
            if (err) {
                res.status(500).send({message: err.toString()});
            }
            else if (!user) {
                res.status(404).send({userId: user.userId, userExists: false});
            }
            else {
                res.status(200).send({userId: user.userId, userExists: true});
            }
        });
    }).catch(error => {
        res.status(400).send({message: error.message});
    })
});

router.post("/sign-out", (req, res) => { //change
    if (DataValidator.isTokenValid(req.body.userId)) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;