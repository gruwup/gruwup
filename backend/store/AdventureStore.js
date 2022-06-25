const Adventure = require("../models/Adventure");

module.exports = class AdventureStore {
    static createAdventure = async (adventure) => {
        var adventure = new Adventure(adventure);
        
        try {
            var result = await adventure.save();
            result.adventureId = result._id;
            return {
                code: 200,
                message: "Adventure created successfully",
                payload: result
            };
        }
        catch (err) {
            return {
                code: 400,
                message: err
            };
        }
    };

    static getAdventureDetail = async (adventureId) => {
        try {
            var result = await Adventure.findById(adventureId);
            if (result) {
                return {
                    code: 200,
                    message: "Adventure found",
                    payload: result
                };
            }
            else {
                return {
                    code: 404,
                    message: "Adventure not found"
                };
            }
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        };
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