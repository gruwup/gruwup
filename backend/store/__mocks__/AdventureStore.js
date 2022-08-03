const MockTestData = require('../../test/MockTestData');

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
        var category;
        for (var i = 0; i < data.length; i++) {
            if (filter.city === data[i].city) {
                if (result.indexOf(data[i]) === -1) result.push(data[i]);
            }
            if (filter.$and && filter.$and[2].category) { //test getRecommendation
                category = filter.$and[2].category;
                if (category.$in) {
                    for (var j = 0; j < category.$in.length; j++) {
                        if (category.$in[j] !== data[i].category) {
                            console.log(data[i]._id + " " + filter.$and[1]._id.$nin);
                            if (filter.$and[1]._id.$nin.indexOf(data[i]._id) === -1) {
                                if (result.indexOf(data[i]) === -1) result.push(data[i]);
                            }
                        }
                    }
                }
            }
            
            else if (filter.$and && filter.$and[0].category.$in && filter.$and[1].dateTime.$lte) { //findByFilter
                category = filter.$and[0].category.$in;
                var dateTime = filter.$and[1].dateTime.$lte;
                for (var k = 0; k < category.length; k++) {
                    if (category[k] === data[i].category && dateTime >= data[i].dateTime) {
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
        return new Promise((resolve, reject) => {
            resolve({
                code: 200,
                message: result.length ? "Adventures found" : "Adventures not found",
                payload: result
            });
        });
    });
};