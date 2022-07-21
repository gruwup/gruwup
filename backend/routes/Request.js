const express = require("express");
const router = express.Router();
const RequestStore = require("../store/RequestStore");
const TestMode = require("../TestMode");
const Session = require("../services/Session");

router.post("/:adventureId/send-request", async (req, res) => {
	if (!(Session.validSession(req.headers.cookie) || TestMode.on)) {
		return res.status(403).send({ message: Session.invalid_msg });
    }

    return await RequestStore.sendRequest(req.params.adventureId, req.body).then(result => {
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
		return await RequestStore.getRequests(req.params.userId).then(result => {
			if (result.code === 200) {
				return res.status(200).send({
					requests: result.payload
				});
			}
			return res.status(result.code).send(result.message);
		}, err => {
			return res.status(500).send(err._message);
		});
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

router.put("/:requestId/accept", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		return await RequestStore.acceptRequest(req.params.requestId, req).then(result => {
            if (result.code === 200) {
				return res.status(200).send(result.message);
			}
			return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err);
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

router.put("/:requestId/reject", async (req, res) => {
	if (Session.validSession(req.headers.cookie) || TestMode.on) {
		return await RequestStore.rejectRequest(req.params.requestId).then(result => {
			if (result.code === 200) {
				return res.status(200).send(result.message);
			}
			return res.status(result.code).send(result.message);
		}
		, err => {
			return res.status(500).send(err._message);
		});
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;