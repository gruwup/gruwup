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
        categories: req.body.categories,
        image: req.body.image ? req.body.image : null
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

router.get("/:userId/get", (req, res) => {
    // TODO: validate token
    Profile.findOne({ userId: req.params.userId }, (err, profile) => {
        if (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
        else if (!profile) {
            res.status(404).send({
                message: "Profile not found"
            });
        }
        else {
            res.status(200).send(profile);
        }
    });
});

router.put("/:userId/edit", (req, res) => {
    // TODO: validate token
    Profile.findOneAndUpdate(
        { userId: req.params.userId }, 
        { $set: { name: req.body.name, biography: req.body.biography, categories: req.body.categories, image: req.body.image } },
        {new: true},
        (err, profile) => {
            if (err) {
                res.status(500).send({
                    message: err.toString()
                });
            }
            else if (!profile) {
                res.status(404).send({
                    message: "Profile not found"
                });
            }
            else {
                res.status(200).send(profile);
            }
        }
    );
});

module.exports = router;