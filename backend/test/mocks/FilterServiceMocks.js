const MockTestData = require('./MockTestData');

module.exports = class FilterServiceMocks {
    static getNearbyAdventures = jest.fn((cityName) => {
        result = {
            code: 200,
            message: "Nearby adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
        return result;
    });
    
    static getRecommendationFeed = jest.fn((userId) => {
        result = {
            code: 200,
            message: "Recommendation feed generated",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
        return result;
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
        return result;
    });
};