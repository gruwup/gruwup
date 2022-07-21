const Request = require("../models/Request");
const Adventure = require("../models/Adventure");
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = class RequestStore {
    static sendRequest = async (adventureId, request) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        await Adventure.findById(adventureId).then(async adventure => {
            result = {
                code: 404,
                message: "Adventure not found"
            };

            if (adventure) {
                await this.checkIfRequestExists(adventureId, request.userId).then(async requestExistResult => {
                    result = {
                        code: 400,
                        message: "You have already sent a request to this adventure"
                    };
                    if (requestExistResult.code === 404) {
                        var requestObj = new Request({
                            requester: request.userName,
                            adventureId,
                            adventureOwner: adventure.owner,
                            adventureTitle: adventure.title,
                            requesterId: request.userId,
                            status: "PENDING",
                            dateTime: request.dateTime,
                            adventureExpireAt: adventure.dateTime
                        });
                        await requestObj.save().then(requestResult => {
                            result = {
                                code: 200,
                                message: "Request sent",
                                payload: requestResult
                            };
                        }
                        , err => {
                            result = {
                                code: 500,
                                message: err.message
                            };
                        });
                    }
                }, err => {
                    result = {
                        code: 500,
                        message: err._message
                    };
                });
            }
        }, err => {
            result = {
                code: 500,
                message: err.message
            };
        });
        return result;
    };

    static getRequests = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        const asRequesterQuery = {
            $and : [
                { requesterId: userId },
                { status: "PENDING" }
            ]
        };

        const asAdventureOwnerQuery = {
            $and : [
                { adventureOwner: userId },
                { status: "PENDING" }
            ]
        }

        await Request.find(asRequesterQuery).then(async asRequester => {
            await Request.find(asAdventureOwnerQuery).then(asAdventureOwner => {
                result = {
                    code: 200,
                    message: "Requests found",
                    payload: asRequester.concat(asAdventureOwner).sort((a, b) => {
                        return b.dateTime - a.dateTime;
                    })
                };
            }, err => {
                result = {
                    code: 500,
                    message: err.message
                };
            });
        }, err => {
            result = {
                code: 500,
                message: err.message
            };
        });
        return result;
    };

    static acceptRequest = async (requestId) => {
        var result = {};

        if (!ObjectId.isValid(requestId)) {
            result ={
                code: 404,
                message: "Adventure not found"
            };
            return result;
        }
        await Request.findByIdAndUpdate(requestId, { status: "ACCEPTED" }).then(async requestResult => {
            const pushQuery = { peopleGoing: requestResult.requesterId }
            await Adventure.findOneAndUpdate({ _id: requestResult.adventureId }, { $push: pushQuery}, { new: true, runValidators: true }).then(adventureResult => {
                result = {
                    code: 404,
                    message: "Adventure not found"
                };
                if (adventureResult) {
                    result ={
                        code: 200,
                        message: "Request accepted"
                    }
                }
            }, err => {
                result.code = (err.name === "ValidationError") ? 400 : 500;
                result.message = err._message;
            });
            if (!ObjectId.isValid(requestResult.adventureId)) {
                result ={
                    code: 404,
                    message: "Adventure not found"
                };
            }
        }, err => {
            result = {
                code: 500,
                message: err._message
            };
        });
        return result;
    };

    static rejectRequest = async (requestId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!ObjectId.isValid(requestId)) {
            result = {
                code: 400,
                message: "Invalid request id"
            };
            return result;
        }

        await Request.findByIdAndUpdate(requestId, { status: "REJECTED" }).then(async requestResult => {
            result = {
                code: 200,
                message: "Request rejected"
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

    static checkIfRequestExists = async (adventureId, userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        const findQuery = {
            $and: [
                { adventureId },
                { requesterId: userId }
            ]
        };

        await Request.findOne(findQuery).then(async requestResult => {
            result = {
                code: 404,
                message: "Request not found"
            };

            if (requestResult) {
                result = {
                    code: 200,
                    message: "Request found"
                };
            }
        }, err => {
            result = {
                code: 500,
                message: err._message
            };
        });
        return result;
    };
};