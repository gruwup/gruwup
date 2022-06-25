const Adventure = require("../models/Adventure");

module.exports = class AdventureStore {
    static createAdventure = async (adventure) => {
        var adventure = new Adventure(adventure);
        
        try {
            await adventure.save();
            return {
                code: 200,
                message: "Adventure created successfully",
                payload: adventure
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static getAdventureDetail = async (req, res) => {
        Adventure.findById(req.params.adventureId, (err, adventure) => {
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
        });
    };

    static updateAdventure = async (req, res) => {
        Adventure.findOneAndUpdate(
            { _id: req.params.adventureId },
            { $set: { title: req.body.title, description: req.body.description, peopleGoing:req.body.peopleGoing, dateTime: req.body.dateTime, location: req.body.location, category: req.body.category, image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null } },
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

    static getUsersAdventures = async (req, res) => {
        Adventure.find({
            $and: [
                { 
                    $or: [
                        { owner: req.params.userId },
                        { peopleGoing: { $in: req.params.userId} },
                    ]
                },
                {
                    status: "OPEN"
                }
            ]
            
        }, (err, adventures) => {
            if (err) {
                res.status(500).send({
                    message: err.toString()
                });
            }
            else if (!adventures) {
                res.status(404).send({
                    message: "No adventures found"
                });
            }
            else {
                res.status(200).send(adventures.map(adventure => adventure._id));
            }
        });
    };
};