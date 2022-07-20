const MockTestData = require('./MockTestData');

module.exports = class RequestStoreMocks {
    static sendRequest = jest.fn((request) => {
        result = {
            code: 200,
            message: "Request sent successfully",
            payload: MockTestData.testRequest1
        }
        return result;
    });

    static getRequests = jest.fn((userId) => {
        result = {
            code: 200,
            message: "Requests found",
            payload: [
                MockTestData.testRequest1,
                MockTestData.testRequest2
            ]
        }
        return result;
    });

    static acceptRequest = jest.fn((requestId) => {
        var acceptedRequest = MockTestData.testRequest1;
        acceptedRequest.status = "ACCEPTED";
        result = {
            code: 200,
            message: "Request accepted successfully",
            payload: acceptedRequest
        }
        return result;
    });

    static rejectRequest = jest.fn((requestId) => {
        var rejectedRequest = MockTestData.testRequest1;
        rejectedRequest.status = "REJECTED";
        result = {
            code: 200,
            message: "Request rejected successfully",
            payload: rejectedRequest
        }
        return result;
    });

    static checkIfRequestExists = jest.fn((userId, adventureId) => {
        result = {
            code: 200,
            message: "Request found",
            payload: MockTestData.testRequest1
        }
        return result;
    });
}