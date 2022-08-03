const MockTestData = require('../MockTestData');
const FilterService = require("../../services/FilterService");
const Adventure = require("../../models/Adventure");
const mongoose = require("mongoose");

const testMongoPort = "27017";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB at Url: %s", mongoDbUrl)).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

jest.mock("../../store/AdventureStore");
jest.mock("../../store/UserStore");

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
            city
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
            expect.objectContaining([
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]));
    });

    test('No nearby adventures', async () => {
        var result = await FilterService.getNearbyAdventures("Toronto")
        expect(result).toEqual({
            code: 200,
            message: "Nearby adventures found",
            payload: []
        });
    });

    test('Invalid city name', async () => {
        var result = await FilterService.getNearbyAdventures(null)
        expect(result).toEqual({
            code: 400,
            message: "Invalid city name"
        });
    });
});

describe("getRecommndationFeed tests", () => {
    test("Success scenario", async () => {
        var result = await FilterService.getRecommendationFeed("3");
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Recommendation feed found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]));
    });

    test('No nearby adventures', async () => {
        var result = await FilterService.getRecommendationFeed("2");
        expect(result).toEqual({
            code: 200,
            message: "Recommendation feed found",
            payload: []
        });
    });

    test('Non-existent user', async () => {
        var result = await FilterService.getRecommendationFeed("1");
        expect(result).toEqual({
            code: 404,
            message: "User Profile not found"
        });
    });
});

describe("findAdventureByFilter tests", () => {
    test("success scenario", async () => {
        filter = { 
            categories: ["ART", "MOVIE"],
            maxTimeStamp: "9999999999" ,
            city: "Vancouver",
            maxPeopleGoing: "99999999"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Adventures found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([
                MockTestData.testAdventure1,
                MockTestData.testAdventure2
            ]));
    });

    test("No adventure match category", async () => {
        filter = { 
            categories: [],
            maxTimeStamp: "9999999999" ,
            city: "Vancouver",
            maxPeopleGoing: "99999999"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Adventures found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([]));
    });

    test("No adventure match time", async () => {
        filter = { 
            categories: ["ART", "MOVIE"],
            maxTimeStamp: "0" ,
            city: "Vancouver",
            maxPeopleGoing: "99999999"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Adventures found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([]));
    });

    test("No adventure match city", async () => {
        filter = { 
            categories: ["ART", "MOVIE"],
            maxTimeStamp: "9999999999" ,
            city: "Toronto",
            maxPeopleGoing: "99999999"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Adventures found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([]));
    });

    test("No adventure match max people going", async () => {
        filter = { 
            categories: ["ART", "MOVIE"],
            maxTimeStamp: "9999999999" ,
            city: "Toronto",
            maxPeopleGoing: "0"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Adventures found',
            }));

        expect(result.payload).toEqual(
            expect.objectContaining([]));
    });

    test("Invalid input - missing field", async () => {
        filter = { 
            maxTimeStamp: "9999999999" ,
            city: "Toronto",
            maxPeopleGoing: "0"
        }
        var result = await FilterService.findAdventuresByFilter(filter);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 400, 
                message: 'Mandatory filter field missing',
            }));
    });
});