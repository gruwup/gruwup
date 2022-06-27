const express = require("express");
const UserStore = require("../store/UserStore");

const router = express.Router();

router.post("/create", (req, res) => {
    if (Session.validSession(req.headers.cookie)) {
        const profile = {
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
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({message: "Invalid cookie"});
    }
});

router.get("/:userId/get", (req, res) => {
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