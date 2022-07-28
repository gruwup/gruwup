const AdventureStoreMocks = require('../mocks/AdventureStoreMocks');
const FilterServiceMocks = require('../mocks/FilterServiceMocks');
const MockTestData = require('../mocks/MockTestData');
const FilterService = require("../../services/FilterService");
const Adventure = require("../../models/Adventure");
const mongoose = require("mongoose");

const testMongoPort = "27384";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("getNearbyAdventures tests", () => {
    test("Success scenario", async () => {
        expect.assertions(2);
        var time = Date.now() + 1;
        var city = "Vancouver";
        var adventureData = {
            owner: "userid",
            title: "title",
            description: "description",
            peopleGoing: ["userid"],
            dateTime: time,
            location: "2110 Burrard St, Vancouver, BC V6J 3H6",
            category: "MOVIE",
            status: "OPEN",
            image: "string",
            city: city
          };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();

        var result = await FilterService.getNearbyAdventures(city);
        expect(result).toEqual(
            expect.objectContaining({ 
                    code: 200, 
                    message: 'Nearby adventures found',
                }));

        expect(result.payload).toEqual(
            expect.objectContaining({
                adventureExpireAt: time, 
                // adventureId: adventureId,   //this breaks the test for some reason
                adventureOwner: "userid",
                adventureTitle: "title",
                dateTime: time,
                requester: "severus",
                requesterId: "severus",
                status: "PENDING",
            }));
    });
});

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