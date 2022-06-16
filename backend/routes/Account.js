const express = require("express");
const DataValidator = require("../constants/DataValidator");
const GoogleAuth = require("../services/GoogleAuth");
const router = express.Router();

// TODO: need database to store profile information based on user token

// can delete this later, just for early testing
const example = {
    "userId": "string",
    "name": "Bob John",
    "biography": "I am a 20 year old living in Vancouver",
    "categories": [1, 2, 3]
  }

router.post("/sign-in", (req, res) => {
    try {
        var response = GoogleAuth.validateToken(req.body.authentication_code);
        // do something to check response? and get fields from google if verified
        var userInfo = {
            userId: response.userId,
            userExists: false // replace after checking if user exists in database
        }
        res.status(200).send(userInfo);
    }
    catch {
        res.sendStatus(400);
    }
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