const MockTestData = require('../../test/MockTestData');

module.exports = class RequestStoreMocks {
    static getRequests = jest.fn((userId) => {
        var result =  {
            code: 200,
            message: "Requests found",
            payload: [
                MockTestData.testRequest3,
                MockTestData.testRequest4
            ]
        }

        if (userId === '4') {
            result = {
                code: 200,
                message: "Requests found",
                payload: [
                    MockTestData.testRequest1,
                    MockTestData.testRequest2
                ]
            }
        }
        
        return new Promise((resolve, reject) => {
            resolve(result);
        });
    });
}