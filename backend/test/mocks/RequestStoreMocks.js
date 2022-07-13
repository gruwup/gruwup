const MockTestData = require('./MockTestData');

module.exports = class RequestStoreMocks {
    static sendRequest = jest.fn((request) => {
        return {
            code: 200,
            message: "Request sent successfully",
            payload: MockTestData.testRequest1
        }
    });

    static getRequests = jest.fn((userId) => {
        return {
            code: 200,
            message: "Requests found",
            payload: [
                MockTestData.testRequest1,
                MockTestData.testRequest2
            ]
        }
    });

    static acceptRequest = jest.fn((requestId) => {
        var acceptedRequest = MockTestData.testRequest1;
        acceptedRequest.status = "ACCEPTED";
        return {
            code: 200,
            message: "Request accepted successfully",
            payload: acceptedRequest
        }
    });

    static rejectRequest = jest.fn((requestId) => {
        var rejectedRequest = MockTestData.testRequest1;
        rejectedRequest.status = "REJECTED";
        return {
            code: 200,
            message: "Request rejected successfully",
            payload: rejectedRequest
        }
    });

    static checkIfRequestExists = jest.fn((userId, adventureId) => {
        return {
            code: 200,
            message: "Request found",
            payload: MockTestData.testRequest1
        }
    });
}