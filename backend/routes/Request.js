const express = require("express");
const DataValidator = require("../constants/DataValidator");
const router = express.Router();
const AdventureStore = require("../store/AdventureStore");
const RequestStore = require("../store/RequestStore");

// these are just for testing, delete later
const example = {
    "adventureId": "string",
    "requester": "Bob John",
	"requesterId": "string",
	"accepted": [],
	"rejected": [],
    "state": "pending",
    "dateTime": "123456789"
}

const example_req = {
    "requests": [
		{
			"adventureId": "string",
			"requester": "Bob John",
			"requesterId": "string",
			"accepted": [],
			"rejected": [],
			"state": "pending",
			"dateTime": "123456789"
		},
		{
			"adventureId": "string",
			"requester": "Bob John",
			"requesterId": "string",
			"accepted": [],
			"rejected": [],
			"state": "pending",
			"dateTime": "123456789"
		}
    ]
}

router.post("/:adventureId/make-request", async (req, res) => {
	// TODO: validate token and request
	try {
		var adventure = await AdventureStore.getAdventureDetail(req.params.adventureId);
		if (adventure.payload.status != "OPEN") {
			return res.status(400).send("Adventure is not open");
		}
    	var participants = adventure.payload.peopleGoing;
		if (participants.length > 0) {
			var request = {
				adventureId: req.params.adventureId,
				adventureParticipants: participants,
				requester: req.body.requester,
				requesterId: req.body.requesterId,
				status: "PENDING",
				dateTime: req.body.dateTime
			};
			var result = await RequestStore.storePendingRequest(request);
			if (result.code === 200) {
				res.status(200).send(result.payload);
			}
			else {
				res.status(result.code).send(result.message);
			}
		}
		else {
			res.status(404).send("Participants not found");
		}
	}
	catch (err) {
    	res.status(500).send(err);
	}
});

router.get("/:userId/get", async (req, res) => {
    try {
		var result = await RequestStore.getRequests(req.params.userId);
		if (result.code === 200) {
			res.status(200).send(result.payload);
		}
		else {
			res.status(result.code).send(result.message);
		}
	}
	catch (err) {
		res.status(500).send(err);
	}
});

router.put("/:requestId/respond", async (req, res) => {
    //TODO: validate token
	try {
		var result = await RequestStore.sendResponse(req.params.requestId, req.body.userId, req.body.response);
		if (result.code === 200) {
			res.status(200).send(result.message);
		}
		else {
			res.status(result.code).send(result.message);
		}
	}
	catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;