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

    static updateAdventure = async (adventureId, adventure) => {
        try {
            var result = await Adventure.findOneAndUpdate(
                { _id: adventureId },
                { $set: adventure },
                {new: true});
            return {
                code: 200,
                message: "Adventure updated successfully",
                payload: result
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static cancelAdventure = async (req, res) => {
        try {
            var result = await Adventure.findOneAndUpdate(
                { _id: req.params.adventureId },
                { $set: { status: "CANCELLED" } },
                {new: true});
            if (result) {
                return {
                    code: 200,
                    message: "Adventure cancelled successfully",
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
        }
    };

    static getUsersAdventures = async (userId) => {
        try {
            var result = await Adventure.find({
                $and: [
                    { 
                        $or: [
                            { owner: userId },
                            { peopleGoing: { $in: userId} },
                        ]
                    },
                    {
                        status: "OPEN"
                    }
                ]
            });
            return {
                code: 200,
                message: "Adventures found",
                payload: result.map(adventure => adventure._id)
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static addAdventureParticipant = async (adventureId, userId) => {
        try {
            var result = await Adventure.findOneAndUpdate(
                { _id: adventureId },
                { $push: { peopleGoing: userId } },
                { new: true }
            );
            if (result) {
                return {
                    code: 200,
                    message: "Adventure participant added successfully"
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
        }
    };
};