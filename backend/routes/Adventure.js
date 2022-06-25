const express = require("express");
const router = express.Router();
const Constants = require("../constants/Constants");
const AdventureStore = require("../store/AdventureStore");

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
router.post("/create", async (req, res) => {
    // TODO: validate token
    var adventure = {
        owner: req.body.owner,
        title: req.body.title,
        description: req.body.description,
        peopleGoing: [req.body.owner],
        dateTime: req.body.dateTime,
        location: req.body.location,
        category: req.body.category,
        status: "OPEN",
        image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null,
        city: req.body.location.split(", ")[1] ?? "unknown"
    };
    try {
        var result = await AdventureStore.createAdventure(adventure);
        if (result.code === 200) {
            res.status(200).send(result.payload);
        }
        else {
            res.status(result.code).send(result.message);
        }
    } catch (err) { 
        res.status(500).send(err);
    }
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
    try {
        AdventureStore.getAdventureDetail(req, res);
    } catch (err) { 
        res.status(500).send(err);
    }
});

// update adventure details
router.put("/:adventureId/update", (req, res) => {
    // TODO: validate token
    try {
        AdventureStore.updateAdventure(req, res);
    } catch (err) {
        res.status(500).send(err);
    }
});

// cancel the adventure and delete chat room
router.put("/:adventureId/cancel", (req, res) => {
    // TODO: validate token
    // TODO: delete chat room
    try {
        AdventureStore.cancelAdventure(req, res);
    } catch (err) {
        res.status(500).send(err);
    }
});

// get ids of adventures owned or participated by user that are not cancelled
router.get("/:userId/get-adventures", (req, res) => {
    try {
        AdventureStore.getUsersAdventures(req, res);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;