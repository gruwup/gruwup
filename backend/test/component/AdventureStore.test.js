const AdventureStore = require("../../store/AdventureStore");
const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;

const defaultMongoPort = "27017";
const customMongoPort = "27384";

var useDefaultMongoPort = false;
var mongoDbUrl = "mongodb://localhost:" + (useDefaultMongoPort ? defaultMongoPort : customMongoPort);

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    console.log("after all running");
    await mongoose.connection.close();
});

describe("createAdventure tests", () => {
    test("missing input", async () => {
        expect.assertions(1);
        expect(await AdventureStore.createAdventure()).toEqual({
            code: 400,
            message: "Adventure is required"
        });
    });

    test("input data missing required field", async () => {
        expect.assertions(1);
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city"
        };
        await AdventureStore.createAdventure(adventure).then(
            result => {
                expect(result).toEqual({
                    code: 400,
                    message: "Adventure validation failed: dateTime: Path `dateTime` is required."
                });
            }
        );
    });

    test("input data is illegal", async () => {
        expect.assertions(1);
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: 123
        };
        await AdventureStore.createAdventure(adventure).then(
            result => {
                expect(result).toEqual({
                    code: 400,
                    message: "Adventure validation failed: dateTime: 123 dateTime cannot be in the past"
                });
            }
        );
    });

    test("success scenario", async () => {
        expect.assertions(4);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        await AdventureStore.createAdventure(adventure).then(
            result => {
                expect(result.code).toEqual(200);
                expect(result.message).toEqual("Adventure created successfully");
                expect(result.payload).toEqual(expect.objectContaining({
                    owner: "Test User",
                    title: "Test Adventure",
                    description: "Test Adventure description",
                    category: "MOVIE",
                    peopleGoing: ["Test User"],
                    location: "Test location, Test city",
                    dateTime: futureTimeStamp,
                    city: "Test city",
                    status: "OPEN"
                }));
                expect(ObjectId.isValid(result.payload._id)).toBeTruthy();
            }
        );
    });
});

describe("getAdventureDetail tests", () => {

});

describe("updateAdventure tests", () => {

});

describe("cancelAdventure tests", () => {
    
});

describe("searchAdventuresByTitle tests", () => {
});

describe("getUsersAdventures tests", () => {
});

describe("removeAdventureParticipant tests", () => {
});

describe("findAdventuresByFilter tests", () => {
});