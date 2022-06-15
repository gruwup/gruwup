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
    res.send("Adventure route live");
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
    console.log(req.params.adventureId);
    res.status(200).send(TestAdventure);
});

// update adventure details
router.put("/:adventureId/update", (req, res) => {
    console.log(req.params.adventureId);
    res.status(200).send(TestAdventure);
});

// Cancel the adventure and delete chat room
router.delete("/:adventureId/cancel", (req, res) => {
    console.log(req.params.adventureId);
    res.status(200).send();
});

module.exports = router;