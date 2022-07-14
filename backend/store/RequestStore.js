const Request = require("../models/Request");
const Adventure = require("../models/Adventure");
var ObjectId = require('mongoose').Types.ObjectId;

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
                message: err._message
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
            return {
                code: 200,
                message: "Requests found",
                payload: result
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err._message
            };
        }
    };

    static acceptRequest = async (requestId) => {
        try {
            if (!ObjectId.isValid(requestId)) {
                return {
                    code: 400,
                    message: "Invalid request id"
                };
            }
            var request = await Request.findByIdAndUpdate(requestId, { status: "ACCEPTED" });
            if (!ObjectId.isValid(request.adventureId)) {
                return {
                    code: 404,
                    message: "Adventure not found"
                };
            }
            await Adventure.findOneAndUpdate(
                        { _id: request.adventureId },
                        { $push: { peopleGoing: request.requesterId } },
                        { new: true }
                    );
                    
            return {
                code: 200,
                message: "Request accepted",
                payload: request
            }

        }
        catch (err) {
            return {
                code: 500,
                message: err._message
            };
        }
    };

    static rejectRequest = async (requestId) => {
        try {
            if (!ObjectId.isValid(requestId)) {
                return {
                    code: 400,
                    message: "Invalid request id"
                };
            }
            await Request.findByIdAndUpdate(requestId, { status: "REJECTED" });
            return {
                code: 200,
                message: "Request rejected"
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err._message
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
                message: err._message
            };
        }
    };
};