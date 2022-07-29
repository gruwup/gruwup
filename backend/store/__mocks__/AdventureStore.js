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
        var data = [MockTestData.testAdventure1, MockTestData.testAdventure2]
        var result = [];
        for (var i = 0; i < data.length; i++) {
            if (filter.city === data[i].city) {
                if (result.indexOf(data[i]) === -1) result.push(data[i]);
            }
            if (filter.$and && filter.$and[1].category) { //test getRecommendation
                if (filter.$and[1].category.$in) {
                    for (var j = 0; j < filter.$and[1].category.$in.length; j++) {
                        if (filter.$and[1].category.$in[j] === data[i].category) {
                            if (result.indexOf(data[i]) === -1) result.push(data[i]);
                        }
                    }
                }
            }
            else if (filter.$and && filter.$and[0].category.$in && filter.$and[1].dateTime.$lte) { //findByFilter
                for (var k = 0; k < filter.$and[0].category.$in.length; k++) {
                    console.log(filter.$and[0].category.$in[k])
                    if (filter.$and[0].category.$in[k] === data[i].category && filter.$and[1].dateTime.$lte >= data[i].dateTime) {
                        if (filter.$and[2] && filter.$and[2].city) {
                            if (filter.$and[2].city === data[i].city) {
                                if (result.indexOf(data[i]) === -1) result.push(data[i]);
                            }
                        }
                        else {
                            if (result.indexOf(data[i]) === -1) result.push(data[i]);
                        }
                    }
                }
            }
        }
        console.log(result);
        return new Promise((resolve, reject) => {
            resolve({
                code: 200,
                message: result.length ? "Adventures found" : "Adventures not found",
                payload: result
            });
        });
    });
};