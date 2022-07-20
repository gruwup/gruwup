const Request = require("../models/Request");
const Adventure = require("../models/Adventure");
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = class RequestStore {
    static sendRequest = async (request) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        var newRequest = new Request(request);
        try {
            var saveResult = await newRequest.save();
            saveResult.requestId = saveResult._id;
            result = {
                code: 200,
                message: "Request sent successfully",
                payload: saveResult
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

    static getRequests = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        try {
            var asRequester = await Request.find({ requesterId: userId });
            var asCreator = await Request.find({
                $and: [
                    { adventureOwner: userId },
                    { status: "PENDING" }
                ]}
            );
            var findResult = asRequester.concat(asCreator);
            findResult.sort((a, b) => {
                return b.dateTime - a.dateTime;
            });
            result = {
                code: 200,
                message: "Requests found",
                payload: findResult
            };
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    };

    static acceptRequest = async (requestId) => {
        var result = {
            code: 500,
            message: "Server error"
        };
        try {
            if (!ObjectId.isValid(requestId)) {
                result ={
                    code: 400,
                    message: "Invalid request id"
                };
            }
            else {
                var findRequest = await Request.findByIdAndUpdate(requestId, { status: "ACCEPTED" });
                if (!ObjectId.isValid(request.adventureId)) {
                    result ={
                        code: 404,
                        message: "Adventure not found"
                    };
                }
                else {
                    const pushQuery = { peopleGoing: request.requesterId }
                    await Adventure.findOneAndUpdate(
                                { _id: request.adventureId },
                                { $push: pushQuery},
                                { new: true }
                            );
                            
                    result ={
                        code: 200,
                        message: "Request accepted",
                        payload: request
                    }
                }
                
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    };

    static rejectRequest = async (requestId) => {
        var result = {
            code: 500,
            message: "Server error"
        };
        try {
            if (!ObjectId.isValid(requestId)) {
                result = {
                    code: 400,
                    message: "Invalid request id"
                };
            }
            else {
                await Request.findByIdAndUpdate(requestId, { status: "REJECTED" });
                result = {
                    code: 200,
                    message: "Request rejected"
                };
            }
            
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    };

    static checkIfRequestExists = async (adventureId, userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };
        try {
            var findResult = await Request.findOne({
                $and: [
                    { adventureId },
                    { requesterId: userId }
                ]
            });
            if (findResult) {
                result = {
                    code: 200,
                    message: "Request exists",
                    payload: findResult
                };
            }
            else {
                result = {
                    code: 404,
                    message: "Request not found"
                };
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    };
};