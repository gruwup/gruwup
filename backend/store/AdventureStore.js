const Adventure = require("../models/Adventure");
const UserStore = require("../store/UserStore");

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
            var result = await Adventure.findByIdAndUpdate(adventureId, adventure, {new: true});
            if (result) {
                return {
                    code: 200,
                    message: "Adventure updated successfully",
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

    static cancelAdventure = async (adventureId) => {
        try {
            var result = await Adventure.findOneAndUpdate(
                { _id: adventureId },
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

    static searchAdventuresByTitle = async (title) => {
        try {
            var result = await Adventure.find(
                { $and: [
                    { status: "OPEN" },
                    { title: { $regex: title, $options: "i" }}
                ] });
            return {
                code: 200,
                message: "Adventures found",
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

    static removeAdventureParticipant = async (adventureId, userId) => {
        try {
            var adventure = await Adventure.findById(adventureId);
            console.log(adventure.peopleGoing);
            console.log(adventure.owner);
            console.log(userId);
            console.log(adventure.owner === userId);
            if (!adventure) {
                return {
                    code: 404,
                    message: "Adventure not found"
                };
            }
            else {
                if (adventure.peopleGoing.length === 1 && adventure.owner === userId) {
                    await Adventure.findByIdAndRemove(adventureId);
                    return {
                        code: 200,
                        message: "Adventure removed due to no participants attending anymore"
                    };
                }
                else {
                    var result = {};
                    if (adventure.owner === userId) {
                        var participants = adventure.peopleGoing.filter(participant => participant !== userId);
                        result = await Adventure.findOneAndUpdate(
                            { _id: adventureId },
                            { $set: { owner: participants[0] }, $pull: { peopleGoing: userId } },
                        );
                    }
                    else {
                        result = await Adventure.findOneAndUpdate(
                        { _id: adventureId },
                        { $pull: { peopleGoing: userId } },
                        { new: true }
                    );
                    }
                    
                    if (result) {
                        return {
                            code: 200,
                            message: "Adventure participant removed successfully"
                        };
                    }
                    else {
                        return {
                            code: 404,
                            message: "Adventure not found"
                        };
                    }
                }
            }
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static findAdventuresByFilter = async (filter) => {
        // filter is a list of conditions that adventure needs to satisfy
        try {
            var result = await Adventure.find(
                { $and: [
                    { status: "OPEN" },
                    { $or: filter }
                ] }
            );
            return {
                code: 200,
                message: "Adventures found",
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

    static getRecommendationFeed = async (userId) => {
        try {
            var userProfile = await UserStore.getUserProfile(userId);
            console.log(userProfile.payload);
            if (userProfile.code !== 200) {
                return {
                    code: userProfile.code,
                    message: userProfile.message
                };
            }
            var result = await Adventure.find(
                { $and: [
                    { status: "OPEN" },
                    { category: { $in: userProfile.payload.categories } },
                    { owner: { $ne: userId } },
                    { peopleGoing: { $nin: userId } },
                ] }
            );
            return {
                code: 200,
                message: "Adventures found",
                payload: result
            };
        }
        catch {
            return {
                code: 500,
                message: err
            };
        }
    }
};