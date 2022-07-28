const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Adventure = require("../../models/Adventure");

const testMongoPort = "27385";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /user/adventure/create", () => {
    it("create adventure with valid data", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        await supertest(app).post("/user/adventure/create").send({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
        }).expect(200).then(res => {
            expect(res._body).toEqual(expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimestamp,
                city: "Test city",
                }));
        });
    });

    it("create adventure with invalid dat", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/create").send({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city"
        }).expect(400).then(res => {
            expect(res.text).toEqual("Adventure validation failed: dateTime: Path `dateTime` is required.");
        });
    });

    //todo: invalid cookie test
});

describe("POST /user/adventure/search-by-filter", () => {
    it("search with valid filter and non-empty result", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const searchTimestamp = futureTimestamp + 1000 * 60 * 60 * 24;
        await Adventure.create({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User"]
        });
        await supertest(app).post("/user/adventure/search-by-filter").send({
            categories: "MOVIE",
            maxTimeStamp: searchTimestamp
        }).expect(200).then(res => {
            expect(res._body).toEqual(expect.arrayContaining([expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimestamp,
                city: "Test city",
                })]));
        });
    });

    it("search with valid filter and empty result", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/search-by-filter").send({
            categories: "MOVIE",
            maxTimeStamp: new Date().getTime()
        }).expect(200).then(res => {
            expect(res._body).toEqual([]);
        });
    });

    it("search with invalid filter", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/search-by-filter").send({
            categories: "MOVIE"
        }).expect(400).then(res => {
            expect(res.text).toEqual("Mandatory filter field missing");
        });
    });

    //todo: invalid cookie test
});