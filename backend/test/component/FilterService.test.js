// var AdventureStoreMocks = require('../mocks/AdventureStoreMocks');
// var FilterServiceMocks = require('../mocks/FilterServiceMocks');
// var MockTestData = require('../mocks/MockTestData');

// test('getNearbyAdventures', () => {
//     expect(FilterServiceMocks.getNearbyAdventures("")).toEqual({
//         code: 200,
//         message: "Nearby adventures found",
//         payload: [
//             MockTestData.testAdventure1,
//             MockTestData.testAdventure2
//         ]
//     });
// });

// test('getRecommendationFeed', () => {
//     expect(FilterServiceMocks.getRecommendationFeed("")).toEqual({
//         code: 200,
//         message: "Recommendation feed generated",
//         payload: [
//             MockTestData.testAdventure1,
//             MockTestData.testAdventure2
//         ]
//     });
// });

// test('getAdventuresByFilter', () => {
//     expect(FilterServiceMocks.findAdventuresByFilter({})).toEqual({
//         code: 200,
//         message: "Adventures found",
//         payload: [
//             MockTestData.testAdventure1,
//             MockTestData.testAdventure2
//         ]
//     });
// });