const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

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

describe("POST /adventure/create", () => {
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
        }).then(res => {
            console.log(res);
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
});