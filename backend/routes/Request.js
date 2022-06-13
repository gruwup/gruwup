const express = require("express");
const DataValidator = require("./../Constants/DataValidator.js");
const router = express.Router();

// these are just for testing, delete later
const example = {
    "ReqId": "string",
    "AdventureId": "string",
    "Requester": "Bob John",
    "State": "pending",
    "date": "2022-11-11",
    "time": "12:20:15"
  }

const example_req = {
    "pagination": 0,
    "requests": [
      {
        "ReqId": "string",
        "AdventureId": "string",
        "Requester": "Bob John",
        "State": "pending",
        "date": "2022-12-11",
        "time": "15:13:15"
      },
      {
        "ReqId": "string",
        "AdventureId": "string",
        "Requester": "Bob John",
        "State": "pending",
        "date": "2022-11-11",
        "time": "12:20:15"
      },
      {
        "ReqId": "string",
        "AdventureId": "string",
        "Requester": "Bob John",
        "State": "pending",
        "date": "2022-10-10",
        "time": "12:13:15"
      },
      {
        "ReqId": "string",
        "AdventureId": "string",
        "Requester": "Bob John",
        "State": "pending",
        "date": "2021-11-11",
        "time": "12:13:15"
      }
    ]
  }

router.post("/:adventureId/make-request", (req, res) => {
    if (DataValidator.isTokenValid(req.body.userId)) {
        res.status(200).send(example);
    }
    else {
        res.status(400);
    }
});

router.get("/:userId/check/:pagination", (req, res) => {
    if (DataValidator.isTokenValid(req.params.userId)) {
        res.status(200).send(example_req);
        //TODO
    }
    else {
        res.sendStatus(400);
    }
});

router.post("/:userId/respond", (req, res) => {
    if (DataValidator.isTokenValid(req.params.userId)) {
        // TODO: check field from user
        res.status(200).send(example);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;