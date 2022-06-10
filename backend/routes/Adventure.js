const express = require("express");
const router = express.Router();
const DataValidator = require("../Constants/DataValidator");
const Categories = require("../Constants/DataValidator");

const TestAdventure = {
    id: "2he8-2odw7",
    title: "Doctor Strang: Multiverse of Madness",
    category: "Movie",
    location: "209 5th Ave, Vancouver",
    date: "2022-05-21",
    time: "20:15:19"
}

router.get("/", (req, res) => {
    res.send("Adventure route live");
});

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

module.exports = router;