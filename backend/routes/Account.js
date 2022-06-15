const express = require("express");
const DataValidator = require("../constants/DataValidator");
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
    if (DataValidator.isTokenValid(req.body.userId)) {
        res.status(200).send(example);
    }
    else {
        res.sendStatus(400);
    }
});

router.post("/sign-out", (req, res) => {
    if (DataValidator.isTokenValid(req.body.userId)) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;