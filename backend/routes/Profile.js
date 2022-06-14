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

router.post("/create", (req, res) => {
    if (DataValidator.isTokenValid(req.body.userId)) {
        // TODO: check fields are also valid
        res.status(200).send(example);
    }
    else {
        res.sendStatus(400);
    }
});

router.post("/edit", (req, res) => {
    if (DataValidator.isTokenValid(req.body.userId)) {
        // TODO: check fields are also valid
        res.status(200).send(example);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;