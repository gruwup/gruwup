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
    }
};