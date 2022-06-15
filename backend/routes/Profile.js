const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// can delete this later, just for early testing
const example = {
    "userId": "string",
    "name": "Bob John",
    "biography": "I am a 20 year old living in Vancouver",
    "categories": [1, 2, 3]
  }

router.post("/create", (req, res) => {
    // TODO: validate token
    const profile = new Profile({
        userId: req.body.userId,
        name: req.body.name,
        biography: req.body.biography,
        categories: req.body.categories
    });

    profile.save((err) => {
        if (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
        else {
            res.status(200).send(profile);
        }
    });
});

router.put("/edit", (req, res) => {
    if (DataValidator.isTokenValid(req.body.userId)) {

        // TODO: check fields are also valid
        res.status(200).send(example);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;