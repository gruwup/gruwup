const MockTestData = require('./MockTestData');

module.exports = class ChatStoreMocks {
    static storeNewMessageGroup = jest.fn((adventureId, messages, dateTime) => {
        return {
            code: 200,
            message: "Group created successfully",
            payload: MockTestData.testMessageGroup1
        };
    });

    static storeExistingMessageGroup = jest.fn((adventureId, message, dateTime) => {
        return {
            code: 200,
            message: "Group updated successfully",
            payload: MockTestData.testMessageGroup2
        };
    });

    static getPrevPagination = jest.fn((adventureId, pagination) => {
        return {
            code: 200,
            message: "Previous pagination found",
            payload: "1234"
        };
    });

    static getMessages = jest.fn((adventureId, pagination) => {
        return {
            code: 200,
            message: "Messages found",
            payload: MockTestData.testMessage1
        };
    });

    static getMostRecentMessage = jest.fn((adventureId, dateTime) => {
        return {
            code: 200,
            message: "Messages found",
            payload: MockTestData.testMessage1
        };
    });

    static deleteChat = jest.fn((adventureId) => {
        return {
            code: 200,
            message: "Adventure chat deleted"
        }
    });

}

