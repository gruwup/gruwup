const Request = require("../models/Request");
const AdventureStore = require("./AdventureStore");

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

    static sendResponse = async (requestId, userId, response) => {
        try {
            var request = await Request.findById(requestId);
            if (request.rejected.length > 0) {
                return {
                    code: 400,
                    message: "Request already rejected by one or more other participants"
                };
            }
            if (response === "REJECT") {
                var rejectedRequest = await Request.updateOne({ _id: requestId }, { 
                    $push: { rejected: userId },
                    $set: { status: "REJECTED" }},
                    { new: true }
                );
                if (rejectedRequest) {
                    return {
                        code: 200,
                        message: "Request rejected successfully"
                    };
                }
                else {
                    return {
                        code: 400,
                        message: "Request not found"
                    };
                }
            }
            if (response === "ACCEPT") {
                var acceptRequestQuery = {
                    $push: { accepted: userId }
                };
                var accepted = request.accepted;
                accepted.push(userId);
                if (request.adventureParticipants.every(participant => accepted.includes(participant))) {
                    acceptRequestQuery.$set = { status: "APPROVED" };
                    await AdventureStore.addAdventureParticipant(request.adventureId, request.requester);
                }
                var acceptedRequest = await Request.updateOne({ _id: requestId }, acceptRequestQuery, { new: true });
                if (acceptedRequest) {
                    return {
                        code: 200,
                        message: "Request accepted successfully"
                    };
                }
                else {
                    return {
                        code: 400,
                        message: "Request not found"
                    };
                }
            }
            return {
                code: 400,
                message: "Invalid response option"
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };
};