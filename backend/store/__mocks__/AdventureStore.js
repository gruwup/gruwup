const MockTestData = require('../../test/mocks/MockTestData');

module.exports = class AdventureStoreMocks {
    static createAdventure = jest.fn((adventure) => {
        var result =  {
            code: 200,
            message: "Adventure created successfully",
            payload: MockTestData.testAdventure1
        };
        return result;
    }); 

    static getAdventureDetail = jest.fn((adventureId) => {
        var result =  {
            code: 200,
            message: "Adventure found",
            payload: MockTestData.testAdventure1
        };
        return result;
    });

    static updateAdventure = jest.fn((adventureId, adventure) => {
        var result =  {
            code: 200,
            message: "Adventure updated successfully",
            payload: MockTestData.testAdventure1
        };
        return result;
    });

    static cancelAdventure = jest.fn((adventureId) => {
        var cancelledAdventure = MockTestData.testAdventure1;
        cancelledAdventure.status = "CANCELLED";
        var result =  {
            code: 200,
            message: "Adventure cancelled successfully",
            payload: cancelledAdventure
        };
        return result;
    });

    static searchAdventuresByTitle = jest.fn((title) => {
        var result =  {
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
        var result =  {
            code: 200,
            message: "Adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
        return result;
    });

    static removeAdventureParticipant = jest.fn((adventureId, userId) => {
        var result =  {
            code: 200,
            message: "Adventure participant removed successfully"
        };
        return result;  
    });

    static findAdventuresByFilter = jest.fn((filter) => {
        if (filter.city) {
            if (filter.city === "Toronto") {
                return new Promise((resolve, reject) => {
                    resolve({
                        code: 200,
                        message: "Adventures found",
                        payload: []
                    });
                }); 
            }
        }
        else if (!filter.$and[1].category.$in) {
            return new Promise((resolve, reject) => {
                resolve({
                    code: 200,
                    message: "Adventures found",
                    payload: []
                });
            }); 
        }
        return new Promise((resolve, reject) => {
            resolve({
                code: 200,
                message: "Adventures found",
                payload: [
                    MockTestData.testAdventure1,
                    MockTestData.testAdventure2
                ]
            });
        }); 
    });
};