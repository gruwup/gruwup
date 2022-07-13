const express = require("express");
const router = express.Router();
const FilterService = require("../services/FilterService");
const AdventureStore = require("../store/AdventureStore");
const TestMode = require("../TestMode");
const Session = require("../services/Session");

// test endpoint
router.get("/", (req, res) => {
    res.status(200).send("Adventure route live");
});

// create new adventure
router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.createAdventure(req.body);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        } catch (err) { 
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

// search adventures by filter
router.post("/search-by-filter", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await FilterService.findAdventuresByFilter(req.body);
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

// discover adventure by user favorite categories
router.get("/:userId/discover", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await FilterService.getRecommendationFeed(req.params.userId);
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

// search adventures by title
router.get("/search-by-title", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.searchAdventuresByTitle(req.query.title);
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

// get adventure details
router.get("/:adventureId/detail", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.getAdventureDetail(req.params.adventureId);
            console.log(result);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        } catch (err) { 
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
    
});

// update adventure details (you cannot manually update adventure status this way)
router.put("/:adventureId/update", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var adventure = {
            owner: req.body.owner,
            title: req.body.title,
            description: req.body.description,
            peopleGoing: req.body.peopleGoing,
            dateTime: req.body.dateTime,
            location: req.body.location,
            category: req.body.category,
            image: req.body.image,
            city: req.body.location.split(", ")[1] ?? "unknown"
        };
        try {
            var result = await AdventureStore.updateAdventure(req.params.adventureId, adventure);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
});

// cancel the adventure and delete chat room
router.put("/:adventureId/cancel", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.cancelAdventure(req.params.adventureId);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
    
});

// get ids of adventures owned or participated by user that are not cancelled
router.get("/:userId/get-adventures", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.getUsersAdventures(req.params.userId);
            if (result.code === 200) {
                res.status(200).send(result.payload);
            }
            else {
                res.status(result.code).send(result.message);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        res.status(403).send({ message: Session.invalid_msg });
    }
    
});

// removes user from adventure, select new adventure admin/owner or delete adventure
router.put("/:adventureId/quit", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await AdventureStore.removeAdventureParticipant(req.params.adventureId, req.query.userId);
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

router.get("/nearby", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        try {
            var result = await FilterService.getNearbyAdventures(req.query.city);
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

module.exports = router;