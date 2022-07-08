const express = require("express");
const router = express.Router();
const AdventureStore = require("../store/AdventureStore");
const RequestStore = require("../store/RequestStore");
const TestMode = require("../TestMode");

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

router.post("/:adventureId/send-request", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		try {
			var adventure = await AdventureStore.getAdventureDetail(req.params.adventureId);
			if (adventure.payload.status != "OPEN") {
				return res.status(400).send("Adventure is not open");
			}
			if (adventure.payload.owner == req.body.userId) {
				return res.status(400).send("You cannot request to join your own adventure");
			}
			var checkRequestDuplicate = await RequestStore.checkIfRequestExists(req.params.adventureId, req.body.userId);
			if (checkRequestDuplicate.code == 200) {
				return res.status(400).send("You have already sent a request to this adventure");
			}
			var request = {
				adventureId: req.params.adventureId,
				adventureOwner: adventure.payload.owner,
				adventureTitle: adventure.payload.title,
				requester: req.body.userName,
				requesterId: req.body.userId,
				status: "PENDING",
				dateTime: req.body.dateTime
			};
			var result = await RequestStore.sendRequest(request);
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
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

router.get("/:userId/get-requests", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		try {
			var result = await RequestStore.getRequests(req.params.userId);
			if (result.code === 200) {
				res.status(200).send({
					requests: result.payload
				});
			}
			else {
				res.status(result.code).send(result.message);
			}
		}
		catch (err) {
			res.status(500).send(err);
		}
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

router.put("/:requestId/accept", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		try {
			var result = await RequestStore.acceptRequest(req.params.requestId);
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
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
	
});

router.put("/:requestId/reject", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		try {
			var result = await RequestStore.rejectRequest(req.params.requestId);
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
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

module.exports = router;