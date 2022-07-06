const express = require("express");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const TestMode = require("../TestMode");

const router = express.Router();

router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var profile = {
            userId: req.body.userId,
            name: req.body.name,
            biography: req.body.biography,
            categories: req.body.categories,
            image: req.body.image ? req.body.image : null
        };
    
        try {
            var result = await UserStore.createUser(profile);
            if (result.code === 200) {
                res.sendStatus(200);
            }
            else {
                res.status(result.code).send(result.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

router.get("/:userId/get", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await UserStore.getUserProfile(req.params.userId);
            
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

router.put("/:userId/edit", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        var profile = {
            name: req.body.name,
            biography: req.body.biography,
            categories: req.body.categories,
            image: req.body.image ? req.body.image : null
        };

        try {
            var result = await UserStore.updateUser(req.params.userId, profile);
            if (result.code === 200) {
                res.sendStatus(200);
            }
            else {
                res.status(result.code).send(result.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

module.exports = router;