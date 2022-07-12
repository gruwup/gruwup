const Request = require("../models/Request");
const Adventure = require("../models/Adventure");

module.exports = class RequestStore {
    static sendRequest = async (request) => {
        var request = new Request(request);
        try {
            var result = await request.save();
            result.requestId = result._id;
            return {
                code: 200,
                message: "Request sent successfully",
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

    static getRequests = async (userId) => {
        try {
            var asRequester = await Request.find({ requesterId: userId });
            var asCreator = await Request.find({
                $and: [
                    { adventureOwner: userId },
                    { status: "PENDING" }
                ]}
            );
            var result = asRequester.concat(asCreator);
            result.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            if (result) {
                return {
                    code: 200,
                    message: "Requests found",
                    payload: result
                };
            }
            else {
                return {
                    code: 404,
                    message: "Requests not found"
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

    static acceptRequest = async (requestId) => {
        try {
            var request = await Request.findByIdAndUpdate(requestId, { status: "ACCEPTED" });
            if (!request) {
                return {
                    code: 404,
                    message: "Request not found"
                }
            }
            var result = await Adventure.findOneAndUpdate(
                                    { _id: request.adventureId },
                                    { $push: { peopleGoing: request.requesterId } },
                                    { new: true }
                                );
            if (result) {
                return {
                    code: 200,
                    message: "Request accepted",
                    payload: request
                }
            }
            else {
                return {
                    code: 404,
                    message: "Adventure not found"
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

    static rejectRequest = async (requestId) => {
        try {
            await Request.findByIdAndUpdate(requestId, { status: "REJECTED" });
            return {
                code: 200,
                message: "Request rejected"
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static checkIfRequestExists = async (adventureId, userId) => {
        try {
            var result = await Request.findOne({
                $and: [
                    { adventureId: adventureId },
                    { requesterId: userId }
                ]
            });
            if (result) {
                return {
                    code: 200,
                    message: "Request exists",
                    payload: result
                };
            }
            else {
                return {
                    code: 404,
                    message: "Request not found"
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