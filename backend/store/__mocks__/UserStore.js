const MockTestData = require('../../test/mocks/MockTestData');

module.exports = class RequestStoreMocks {
    static getUserProfile = jest.fn((userId) => {
        var result =  {
            code: 200,
            message: "User Profile found",
            payload: MockTestData.testProfile
        }
        if (userId === "1") {
            result = {
                code: 404,
                message: "User Profile not found"
            }
        }
        return result;
    });
}