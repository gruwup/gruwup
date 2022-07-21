const express = require("express");
const router = express.Router();
const FilterService = require("../services/FilterService");
const AdventureStore = require("../store/AdventureStore");
const TestMode = require("../TestMode");
const Session = require("../services/Session");

// test endpoint
router.get("/", (req, res) => {
    return res.status(200).send("Adventure route live");
});

// create new adventure
router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.createAdventure(req.body).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// search adventures by filter
router.post("/search-by-filter", async (req, res) => {
    if (!(Session.validSession(req.headers.cookie) || TestMode.on)) {
        return await FilterService.findAdventuresByFilter(req.body).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });    
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// discover adventure by user favorite categories
router.get("/:userId/discover", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await FilterService.getRecommendationFeed(req.params.userId).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// search adventures by title
router.get("/search-by-title", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.searchAdventuresByTitle(req.query.title).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// get adventure details
router.get("/:adventureId/detail", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.getAdventureDetail(req.params.adventureId).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }

            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// update adventure details (you cannot manually update adventure status this way)
router.put("/:adventureId/update", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.updateAdventure(req.params.adventureId, req.body).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }

            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// cancel the adventure and delete chat room
router.put("/:adventureId/cancel", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.cancelAdventure(req.params.adventureId).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }

            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// get ids of adventures owned or participated by user that are not cancelled
router.get("/:userId/get-adventures", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.getUsersAdventures(req.params.userId).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
    
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

// removes user from adventure, select new adventure admin/owner or delete adventure
router.put("/:adventureId/quit", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await AdventureStore.removeAdventureParticipant(req.params.adventureId, req.query.userId).then(result => {
            res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

router.get("/nearby", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await FilterService.getNearbyAdventures(req.query.city).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }

            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send(err._message);
        });
    }

    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;