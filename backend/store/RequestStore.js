const Request = require("../models/Request");

module.exports = class RequestStore {
    static storePendingRequest = async (request) => {
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
        // FE would have to process through the accepted/rejected list to find out what state to show user
        try {
            var asRequester = await Request.find({ requesterId: userId });
            var asAdventureParticipant = await Request.find({
                $and: [
                    { adventureParticipants: {$in: userId} },
                    { status: "PENDING" }
                ]}
            );
            var result = asRequester.concat(asAdventureParticipant);
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

};