const Adventure = require("../models/Adventure");
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = class AdventureStore {
    static createAdventure = async (adventure) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        var adventure = {
            owner: adventure.owner,
            title: adventure.title,
            description: adventure.description,
            peopleGoing: [adventure.owner],
            dateTime: adventure.dateTime,
            location: adventure.location,
            category: adventure.category,
            status: "OPEN",
            image: adventure.image,
            city: adventure.location.split(", ")[1] ?? "unknown"
        };
        var adventure = new Adventure(adventure);
        
        try {
            var result = await adventure.save();
            result.adventureId = result._id;
            result = {
                code: 200,
                message: "Adventure created successfully",
                payload: result
            };
        }
        catch (err) {
            result = {
                code: 400,
                message: err._message
            };
        }

        return result;
    };

    static getAdventureDetail = async (adventureId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!ObjectId.isValid(adventureId)) {
            result = {
                code: 400,
                message: "Invalid adventure id"
            };
        }
        else {
            try {
                var findResult = await Adventure.findById(adventureId);
                if (findResult) {
                    result = {
                        code: 200,
                        message: "Adventure found",
                        payload: findResult
                    };
                }
                else {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
            }
            catch (err) {
                result = {
                    code: 500,
                    message: err._message
                };
            };
        }
        return result;
    };

    static updateAdventure = async (adventureId, adventure) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (adventure.location) {
            adventure.city = adventure.location.split(", ")[1] ?? "unknown";
        }

        if (!ObjectId.isValid(adventureId)) {
            result = {
                code: 400,
                message: "Invalid adventure id"
            };
        }
        else {
            try {
                var findResult = await Adventure.findByIdAndUpdate(adventureId, adventure, {new: true});
                if (findResult) {
                    result = {
                        code: 200,
                        message: "Adventure updated successfully",
                        payload: findResult
                    };
                }
                else {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
            }
            catch (err) {
                result = {
                    code: 500,
                    message: err._message
                };
            }
        }
        
        return result;
    };

    static cancelAdventure = async (adventureId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!ObjectId.isValid(adventureId)) {
            result = {
                code: 400,
                message: "Invalid adventure id"
            };
        }
        else {
            const cancelledObj = { status: "CANCELLED" }
            try {
                var findResult = await Adventure.findOneAndUpdate(
                    { _id: adventureId },
                    { $set: cancelledObj},
                    {new: true});
                if (findResult) {
                    result = {
                        code: 200,
                        message: "Adventure cancelled successfully",
                        payload: findResult
                    };
                }
                else {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
            }
            catch (err) {
                result = {
                    code: 500,
                    message: err
                };
            }
        }
        
        return result;
    };

    static searchAdventuresByTitle = async (title) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        try {
            const openStatus = { status: "OPEN" };
            const regexObj = { title: { $regex: title, $options: "i" }};
            var findResult = await Adventure.find(
                { $and: [
                    openStatus,
                    regexObj
                ] });
            findResult.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Adventures found",
                payload: findResult
            };
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }
        
        return result;
    };

    static getUsersAdventures = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        try {
            var findResult = await Adventure.find({
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
            findResult.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Adventures found",
                payload: findResult.map(adventure => adventure._id)
            };
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }

        return result;
    };

    static removeAdventureParticipant = async (adventureId, userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!ObjectId.isValid(adventureId)) {
            result = {
                code: 400,
                message: "Invalid adventure id"
            };
        }
        else {
            try {
                var adventure = await Adventure.findById(adventureId);
                if (!adventure) {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    if (adventure.peopleGoing.length === 1 && adventure.owner === userId) {
                        await Adventure.findByIdAndRemove(adventureId);
                        result = {
                            code: 200,
                            message: "Adventure removed due to no participants attending anymore"
                        };
                    }
                    else {
                        if (adventure.owner === userId) {
                            var participants = adventure.peopleGoing.filter(participant => participant !== userId);
                            await Adventure.findOneAndUpdate(
                                { _id: adventureId },
                                { $set: { owner: participants[0] }, $pull: { peopleGoing: userId } },
                            );
                        }
                        else {
                            await Adventure.findOneAndUpdate(
                            { _id: adventureId },
                            { $pull: { peopleGoing: userId } },
                            { new: true }
                        );}
                        
                        result = {
                            code: 200,
                            message: "Adventure participant removed successfully"
                        };
                    }
                }
            }
            catch (err) {
                result = {
                    code: 500,
                    message: err
                };
            }
        }
        return result;
    };

    static findAdventuresByFilter = async (filter) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        try {
            const openStatus = { status: "OPEN" };
            var result = await Adventure.find(
                { $and: [
                    openStatus,
                    filter
                ] }
            );
            result.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Adventures found",
                payload: result
            };
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }
        return result;
    };
};