const Adventure = require("../models/Adventure");
const { rejectRequest } = require("./RequestStore");
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
        var newAdventure = new Adventure(adventure);

        await newAdventure.save().then(adventure => {
            result = {
                code: 200,
                message: "Adventure created successfully",
                payload: adventure
            };
        }, err => {
            if (err.name === "ValidationError") {
                console.log("result 400");
                result = {
                    code: 400,
                    message: err.message
                };
            }
            else {
                result = {
                    code: 500,
                    message: err._message
                };
            }
        });
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
            await Adventure.findById(adventureId).then(adventure => {
                if (!adventure) {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    result = {
                        code: 200,
                        message: "Adventure found",
                        payload: adventure
                    };
                }
            }
            , err => {
                result = {
                    code: 500,
                    message: err._message
                };
            });
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
            await Adventure.findByIdAndUpdate(adventureId, adventure, { new: true, runValidators: true }).then(adventure => {
                if (!adventure) {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    result = {
                        code: 200,
                        message: "Adventure updated successfully",
                        payload: adventure
                    };
                }
            }
            , err => {
                result = {
                    code: 500,
                    message: err._message
                };
            });
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
            await Adventure.findByIdAndUpdate(adventureId, cancelledObj, { new: true, runValidators: true }).then(adventure => {
                if (!adventure) {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    result = {
                        code: 200,
                        message: "Adventure cancelled successfully",
                        payload: adventure
                    };
                }
            }
            , err => {
                result = {
                    code: 500,
                    message: err._message
                };
            });
        }
        return result;
    };

    static searchAdventuresByTitle = async (title) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        const openStatus = { status: "OPEN" };
        const regexObj = { title: { $regex: title, $options: "i" }};
        await Adventure.find({ $and: [openStatus, regexObj] }).then(adventures => {
            adventures.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Adventures found",
                payload: adventures
            };
        }
        , err => {
                result = {
                    code: 500,
                    message: err._message
                };
            }
        );
        
        return result;
    };

    static getUsersAdventures = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };
        const openStatus = { status: "OPEN" };
        await Adventure.find({
            $and: [
                { 
                    $or: [
                        { owner: userId },
                        { peopleGoing: { $in: userId } },
                    ]
                },
                openStatus
            ]
        }).then(adventures => {
            adventures.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Adventures found",
                payload: adventures
            };
        }
        , err => {
            result = {
                code: 500,
                message: err._message
            };
        });

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
            await Adventure.findById(adventureId).then(async adventure => {
                if (!adventure) {
                    result = {
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    if (adventure.peopleGoing.length === 1 && adventure.owner === userId) {
                        await Adventure.findByIdAndRemove(adventureId).then(adventure => {
                            result = {
                                code: 200,
                                message: "Adventure deleted successfully"
                            };
                        }
                        , err => {
                            result = {
                                code: 500,
                                message: err._message
                            };
                        }
                        );
                    }
                    else {
                        if (adventure.owner === userId) {
                            var participants = adventure.peopleGoing.filter(participant => participant !== userId);
                            await Adventure.findOneAndUpdate(
                                { _id: adventureId },
                                { $set: { owner: participants[0] }, $pull: { peopleGoing: userId } },
                                { new: true, runValidators: true }
                            ).then(adventure => {
                                result = {
                                    code: 200,
                                    message: "Remoced owner successfully, new owner is " + participants[0],
                                    payload: adventure
                                };
                            }, err => {
                                result = {
                                    code: 500,
                                    message: err._message
                                };
                            });
                        }
                        else {
                            await Adventure.findOneAndUpdate(
                                { _id: adventureId },
                                { $pull: { peopleGoing: userId } },
                                { new: true, runValidators: true }
                            ).then(adventure => {
                                result = {
                                    code: 200,
                                    message: "Removed participant successfully",
                                    payload: adventure
                                };
                            }, err => {
                                result = {
                                    code: 500,
                                    message: err._message
                                };
                            });
                        }
                    }
                }
            }
            , err => {
                result = {
                    code: 500,
                    message: err._message
                };
            });
        }
        return result;
    };

    static findAdventuresByFilter = async (filter) => {
        var result = {
            code: 500,
            message: "Server error"
        };


        const openStatus = { status: "OPEN" };
        await Adventure.find(
            { $and: [
                openStatus,
                filter
            ] }
        ).then(adventures => {
            adventures.sort((a, b) => {
                return b.dateTime - a.dateTime;
                });
            result = {
                code: 200,
                message: "Adventures found",
                payload: adventures
            };
        }
        , err => {
            result = {
                code: 500,
                message: err._message
            };
        });
        return result;
    };
};