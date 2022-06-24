const Adventure = require("../models/Adventure");

module.exports = class AdventureStore {
    static createAdventure = async (req, res) => {
        var adventure = new Adventure({
            owner: req.body.owner,
            title: req.body.title,
            description: req.body.description,
            peopleGoing: [req.body.owner],
            dateTime: req.body.dateTime,
            location: req.body.location,
            category: req.body.category,
            status: "OPEN",
            image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null,
            city: req.body.location.split(", ")[1] ?? "unknown"
        });
    
        adventure.save((err, adventureAdded) => {
            if (err) {
                res.status(500).send(err);
            }
            else {
                adventure.adventureId = adventureAdded._id;
                res.status(200).send(adventure);
            }
        });
    };

    static updateAdventure = async (req, res) => {
        Adventure.findOneAndUpdate(
            { _id: req.params.adventureId },
            { $set: { title: req.body.title, description: req.body.description, dateTime: req.body.dateTime, location: req.body.location, category: req.body.category, image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null } },
            {new: true},
            (err, adventure) => {
                if (err) {
                    res.status(500).send({
                        message: err.toString()
                    });
                }
                else if (!adventure) {
                    res.status(404).send({
                        message: "Adventure not found"
                    });
                }
                else {
                    res.status(200).send(adventure);
                }
            }
        );
    };

    static cancelAdventure = async (req, res) => {
        Adventure.findOneAndUpdate(
            { _id: req.params.adventureId },
            { $set: { status: "CANCELLED" } },
            {new: true},
            (err, adventure) => {
                if (err) {
                    res.status(500).send({
                        message: err.toString()
                    });
                }
                else if (!adventure) {
                    res.status(404).send({
                        message: "Adventure not found"
                    });
                }
                else {
                    res.status(200).send(adventure);
                }
            }
        );
    };
};