const MockTestData = require('./MockTestData');

module.exports = class FilterServiceMocks {
    static getNearbyAdventures = jest.fn((cityName) => {
        return {
            code: 200,
            message: "Nearby adventures found",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
    });
    
    static getRecommendationFeed = jest.fn((userId) => {
        return {
            code: 200,
            message: "Recommendation feed generated",
            payload: [
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]
        }
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