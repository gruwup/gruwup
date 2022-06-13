const express = require("express");
const router = express.Router();
const DataValidator = require("../constants/DataValidator");
const Categories = require("../constants/DataValidator");

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
    // category should be stored in ids instead of strings
    // translate id to string to return to frontend

    // all field should exist
    if (!req.body.title) {
        res.status(400).send({message: "[Adventure]: title field cannot be empty"});
    }
    if (!req.body.category) {
        res.status(400).send({message: "[Adventure]: category field cannot be empty"});
    }
    if (!req.body.location) {
        res.status(400).send({message: "[Adventure]: location field cannot be empty"});
    }
    if (!req.body.date) {
        res.status(400).send({message: "[Adventure]: date field cannot be empty"});
    }
    if (!req.body.time) {
        res.status(400).send({message: "[Adventure]: time field cannot be empty"});
    }

    // check validity of fields
    if (!DataValidator.isDateTimeStringValid(req.body.date + " " + req.body.time)) {
        res.status(400).send({message: "[Adventure]: date time invalid"});
    }

    if (!DataValidator.isCatogoryIdValid(req.body.category)) {
        res.status(400).send({message: "[Adventure]: category invalid"});
    }

    res.status(200).send(TestAdventure);
});

// search adventures
router.get("/search/:pagination", (req, res) => {
    console.log("pagination: " + req.params.pagination);
    console.log("pagination limit: " + Constants.SEARCH_PAGINATION_LIMIT);
    res.status(200).send([TestAdventure, TestAdventure]);
});

// search all adventures created by user
router.get("/:userId/get", (req, res) => {
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