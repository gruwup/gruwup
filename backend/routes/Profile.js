const express = require("express");
const UserStore = require("../store/UserStore");

const router = express.Router();

router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
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
                res.status(res.code).send(res.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: "Invalid cookie" });
    }
});

router.get("/:userId/get", async (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        try {
            var result = await UserStore.getUserProfile(req.params.userId);
            if (result.code === 200) {
                res.status(200).send(profile);
            }
            else {
                res.status(res.code).send(res.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: "Invalid cookie" });
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
                res.status(res.code).send(res.message);
            }
        }
        catch (err) {
            res.status(500).send({ message: err.toString() });
        }
    }
    else {
        res.status(403).send({ message: "Invalid cookie" });
    }
});

module.exports = router;