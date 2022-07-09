const express = require("express");
const router = express.Router();
const FilterService = require("../services/FilterService");
const AdventureStore = require("../store/AdventureStore");
const TestMode = require("../TestMode");
const Session = require("../services/Session");

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
    "status": "open",
    "image":`/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdC
    IFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAA
    AADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlk
    ZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAA
    AChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAA
    AAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAA
    AAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3Bh
    cmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADT
    LW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAw
    ADEANv/bAEMA////////////////////////////////////////////////////////////////
    ///////////////////////bAEMB////////////////////////////////////////////////
    ///////////////////////////////////////AABEIASwBLAMBIgACEQEDEQH/xAAXAAEBAQEA
    AAAAAAAAAAAAAAAAAwIB/8QAHRABAQEBAQEBAQEBAAAAAAAAAAECETESIVFBgf/EABUBAQEAAAAA
    AAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAOuAAADv/D8BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2TopmA5MtfMdAc5DjoDPD5jQDHwzz
    ipZ0EvXONWcZBwAAAAAAAAAAAAAAAAAAAAAAAAHQdn7VYnmN28gOiV1actBXsOz+pfNPmgr0S+ac
    oKiX1Y3NdB2zqdnFWdQE3HXAAAAAAAAAAAAAAAAAAAAAAAHXGp6DeXN+NxnU7ATikTjQNu9Y670R
    oZ650V2yVPytWs+0FZ+x1yTkdBKxlTUYBwAAAAAAAAAAAAAAAAAAAAABvLKmYDQAMaz/ALGP2LHA
    R6dV+Z/D5n8BLp+q/M/joJTNqkzI6AAAzpNW+Jf6DgAAAAAAAAAAAAAAAAAAAAAOxWJ59VAAAAAA
    AAAAAAAqN9WSvoMgAAAAAAAAAAAAAAAAAAAAA3lRnLQAAAAAAAAAAAACWvVU9AwAAAAAAAAAAAAA
    AAAAAAADsBWeOkAAAAAAAAAAAAAE9KJ6BgAAAAAAAAAAAAAAAAAAABrPrLeQUAAAAAAAAAAAAAAY
    02xoEwAAAAAAAAAAAAAAAAAAAFMpq5BoAALeJ3QKHUu1ztBbrnUunQW6I9rc0DYAAADOmmdeAm4A
    AAAAAAAAAAAAAAAAAAOqzxKerTwAAGNVhvSYAAAADrgCuWmc+NAAAM68aZ14CQAAAAAAAAAAAAAA
    OgHKpI1wEeUW45YCeVXJOOgAAzpJa+JA4AAAAACufGnM+OgAAM68aZ0CQ64AAAAAAAAAAAAA7HAF
    pXUpeNzQNDnYdB0c7DoOjP0zdA1dJjgAAA61Mgw638nyDUdAAABjTbGgYcAAAAAAAAAAAAAAAAAH
    TrgDvRwAAAAAdcdBTMaZlaAAAAABzsB1PVLpkHAAAAAAAAAAAAAAAAAAAAAAAAAAAAd679MgKfR9
    JgKfTn0wA19VzrgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=
    `
};

// test endpoint
router.get("/", (req, res) => {
    res.status(200).send("Adventure route live");
});

// create new adventure
router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var adventure = {
            owner: req.body.owner,
            title: req.body.title,
            description: req.body.description,
            peopleGoing: [req.body.owner],
            dateTime: req.body.dateTime,
            location: req.body.location,
            category: req.body.category,
            status: "OPEN",
            image: req.body.image,
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
            image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null,
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