const express = require("express");
const router = express.Router();
const Adventure = require("../models/Adventure");


const Constants = require("../constants/Constants");

const TestAdventure = {
    "id": "string",
    "owner": "user id",
    "title": "string",
    "category": "movie",
    "location": "2110 Burrard St, Vancouver, BC V6J 3H6",
    "dateTime": "yyyy-mm-dd hh:mm:ss",
    "peopleGoing": [
        "user id 1",
        "user id 2",
        "user id 3"
    ],
    "status": "open"
};

// test endpoint
router.get("/", (req, res) => {
    res.status(200).send("Adventure route live");
});

// create new adventure
router.post("/create", (req, res) => {
    // TODO: validate token
    var adventure = new Adventure({
        owner: req.body.owner,
        title: req.body.title,
        description: req.body.description,
        peopleGoing: [req.body.owner],
        dateTime: req.body.dateTime,
        location: req.body.location,
        category: req.body.category,
        status: "OPEN",
        image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null
    });

    adventure.save((err, adventureAdded) => {
        if (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
        else {
            adventure.id = adventureAdded._id;
            res.status(200).send(adventure);
        }
    });
});

// search adventures
router.get("/search/:pagination", (req, res) => {
    // TODO: validate token
    console.log("pagination: " + req.params.pagination);
    console.log("pagination limit: " + Constants.SEARCH_PAGINATION_LIMIT);
    res.status(200).send([TestAdventure, TestAdventure]);
});

// search all adventures created by user
router.get("/:userId/get-adventure-ids", (req, res) => {
    console.log(req.params.userId);
    res.status(200).send([TestAdventure]);
});

// get adventure details
router.get("/:adventureId/detail", (req, res) => {
    // TODO: validate token
    Adventure.findById(req.params.adventureId, (err, adventure) => {
        if (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
        else if (!adventure) {
            res.status(404).send({
                message: "Adventure not found"
            });
        }
        else {
            res.status(200).send(adventure);
        }
    });
});

// update adventure details
router.put("/:adventureId/update", (req, res) => {
    // TODO: validate token
    Adventure.findOneAndUpdate(
        { _id: req.params.adventureId },
        { $set: { title: req.body.title, description: req.body.description, dateTime: req.body.dateTime, location: req.body.location, category: req.body.category, image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null } },
        {new: true},
        (err, adventure) => {
            if (err) {
                res.status(500).send({
                    message: err.toString()
                });
            }
            else if (!adventure) {
                res.status(404).send({
                    message: "Adventure not found"
                });
            }
            else {
                res.status(200).send(adventure);
            }
        }
    )
});

// Cancel the adventure and delete chat room
router.delete("/:adventureId/cancel", (req, res) => {
    // TODO: validate token
    Adventure.findOneAndRemove(
        { _id: req.params.adventureId },
        (err, adventure) => {
            if (err) {
                res.status(500).send({
                    message: err.toString()
                });
            }
            else if (!adventure) {
                res.status(404).send({
                    message: "Adventure not found"
                });
            }
            else {
                res.status(200).send({
                    message: "Adventure cancelled"
                });
            }
        }
    );
});

module.exports = router;