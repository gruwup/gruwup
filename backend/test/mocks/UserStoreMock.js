const MockTestData = require('./MockTestData');

module.exports = class UserStoreMocks {
    static getUserProfile = jest.fn((userId) => {
        return {
            code: 200,
            message: "User Profile found",
            payload: MockTestData.testUser
        };
    }); 

    static createUser = jest.fn((profile) => {
        return {
            code: 200,
            message: "Profile created successfully",
            payload: MockTestData.testUser
        };
    });

    static updateUser = jest.fn((userId, profile) => {
        return {
            code: 200,
            message: "Profile exists for userId",
            payload: MockTestData.testUser
        };
    });
};