const MockTestData = require('./MockTestData');

module.exports = class AdventureStoreMocks {
    static createAdventure = jest.fn((adventure) => {
        result = {
            code: 200,
            message: "Adventure created successfully",
            payload: MockTestData.testAdventure1
        };
        return result;
    }); 

    static getAdventureDetail = jest.fn((adventureId) => {
        result = {
            code: 200,
            message: "Adventure found",
            payload: MockTestData.testAdventure1
        };
        return result;
    });

    static updateAdventure = jest.fn((adventureId, adventure) => {
        result = {
            code: 200,
            message: "Adventure updated successfully",
            payload: MockTestData.testAdventure1
        };
        return result;
    });

    static cancelAdventure = jest.fn((adventureId) => {
        var cancelledAdventure = MockTestData.testAdventure1;
        cancelledAdventure.status = "CANCELLED";
        result = {
            code: 200,
            message: "Adventure cancelled successfully",
            payload: cancelledAdventure
        };
        return result;
    });

    static searchAdventuresByTitle = jest.fn((title) => {
        result = {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
        return result;
    });

    static getUsersAdventures = jest.fn((userId) => {
        result = {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });

    static removeAdventureParticipant = jest.fn((adventureId, userId) => {
        result = {
            code: 200,
            message: "Adventure participant removed successfully"
        };  
    });

    static findAdventuresByFilter = jest.fn((filter) => {
        result = {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });
};