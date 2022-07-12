const MockTestData = require('./MockTestData');

module.exports = class AdventureStoreMocks {
    static createAdventure = jest.fn(() => {
        return {
            code: 200,
            message: "Adventure created successfully",
            payload: MockTestData.testAdventure1
        };
    }); 

    static getAdventureDetail = jest.fn((adventureId) => {
        return {
            code: 200,
            message: "Adventure found",
            payload: MockTestData.testAdventure1
        };
    });

    static updateAdventure = jest.fn((adventureId, adventure) => {
        return {
            code: 200,
            message: "Adventure updated successfully",
            payload: MockTestData.testAdventure1
        };
    });

    static cancelAdventure = jest.fn((adventureId) => {
        var cancelledAdventure = MockTestData.testAdventure1;
        cancelledAdventure.status = "CANCELLED";
        return {
            code: 200,
            message: "Adventure cancelled successfully",
            payload: cancelledAdventure
        };
    });

    static searchAdventuresByTitle = jest.fn((title) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });

    static getUsersAdventures = jest.fn((userId) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });

    static removeAdventureParticipant = jest.fn((adventureId, userId) => {
        return {
            code: 200,
            message: "Adventure participant removed successfully"
        };  
    });

    static findAdventuresByFilter = jest.fn((filter) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });
};