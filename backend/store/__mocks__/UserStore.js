const MockTestData = require('../../test/mocks/MockTestData');

module.exports = class RequestStoreMocks {
    static getUserProfile = jest.fn((userId) => {
        console.log(userId);
        var result =  {
            code: 200,
            message: "User Profile found",
            payload: MockTestData.testProfile1
        }
        if (userId === "1") {
            result = {
                code: 404,
                message: "User Profile not found"
            }
        }
        else if (userId === "2") {
            result = {
                code: 200,
                message: "User Profile found",
                payload: MockTestData.testProfile2
            }
        }
        return new Promise ((resolve, reject) => {
            resolve(result);
        });
    });
}