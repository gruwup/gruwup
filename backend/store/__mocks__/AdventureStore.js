const MockTestData = require('../../test/MockTestData');

module.exports = class AdventureStoreMocks {
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