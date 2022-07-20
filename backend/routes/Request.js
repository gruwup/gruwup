const express = require("express");
const router = express.Router();
const AdventureStore = require("../store/AdventureStore");
const RequestStore = require("../store/RequestStore");
const TestMode = require("../TestMode");
const Session = require("../services/Session");

router.post("/:adventureId/send-request", async (req, res) => {
	if (!(Session.validSession(req.headers.cookie) || TestMode.on)) {
		return res.status(403).send({ message: Session.invalid_msg });
    }

    await RequestStore.sendRequest(req.params.adventureId, req.body).then(result => {
		if (result.code === 200) {
			return res.status(200).send(result.message);
		}

		return res.status(result.code).send(result.message);
	}
	, err => {
		return res.status(500).send(err._message);
	});
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