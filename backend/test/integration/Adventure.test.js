const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Adventure = require("../../models/Adventure");
const Profile = require("../../models/Profile");
const { ObjectId } = require("mongodb");

const testMongoPort = "27384";
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
        await supertest(app)    
            .post("/user/adventure/create")
            .set('Cookie', 'gruwup-session=123')
            .send({
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
        await supertest(app).post("/user/adventure/create").set('Cookie', 'gruwup-session=123').send({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city"
        }).expect(400).then(res => {
            expect(res.text).toEqual("Adventure validation failed: dateTime: Path `dateTime` is required.");
        });
    });
    
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/create").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
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
        await supertest(app).post("/user/adventure/search-by-filter").set('Cookie', 'gruwup-session=123').send({
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
        await supertest(app).post("/user/adventure/search-by-filter").set('Cookie', 'gruwup-session=123').send({
            categories: "MOVIE",
            maxTimeStamp: new Date().getTime()
        }).expect(200).then(res => {
            expect(res._body).toEqual([]);
        });
    });

    it("search with invalid filter", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/search-by-filter").set('Cookie', 'gruwup-session=123').send({
            categories: "MOVIE"
        }).expect(400).then(res => {
            expect(res.text).toEqual("Mandatory filter field missing");
        });
    });

    
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/adventure/search-by-filter").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/adventure/:userId/discover", () => {
    it("generate feed for non-exit user", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/testUser/discover").set('Cookie', 'gruwup-session=123').expect(404).then(res => {
            expect(res.text).toEqual("User Profile not found");
        });
    });

    it("generate feed for exit user", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        await Profile.create({
            userId: "testUser",
            name: "Test User",
            biography: "Test User biography",
            categories: ["MOVIE", "MUSIC", "SPORTS"],
        });
        await Adventure.create({
            owner: "testUser2",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User"]
        });

        await supertest(app).get("/user/adventure/testUser/discover").set('Cookie', 'gruwup-session=123').expect(200).then(res => {
            expect(res._body).toEqual(expect.arrayContaining([expect.objectContaining({
                owner: "testUser2",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimestamp,
                city: "Test city",
                status: "OPEN",
                peopleGoing: ["Test User"]
            })]));
        });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/testUser/discover").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/adventure/search-by-title", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/search-by-title").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("search with valid title", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
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
        await supertest(app).get("/user/adventure/search-by-title")
            .set('Cookie', 'gruwup-session=123')
            .query({title: "Test"})
            .expect(200).then(res => {
                expect(res._body).toEqual(expect.arrayContaining([expect.objectContaining({
                    owner: "Test User",
                    title: "Test Adventure",
                    description: "Test Adventure description",
                    category: "MOVIE",
                    location: "Test location, Test city",
                    dateTime: futureTimestamp,
                    city: "Test city",
                    status: "OPEN",
                    peopleGoing: ["Test User"]
                })]));
        });
    });
});

describe("GET /user/adventure/:adventureId/detail", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/123/detail").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/123/detail").set('Cookie', 'gruwup-session=123').expect(400).then(res => {
            expect(res.text).toEqual("Invalid adventure id");
        });
    });

    it("non-exist adventure id", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/" + ObjectId() + "/detail").set('Cookie', 'gruwup-session=123').expect(404).then(res => {
            expect(res.text).toEqual("Adventure not found");
        });
    });

    it("valid adventure id", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
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
        await supertest(app).get("/user/adventure/" + adventure._id + "/detail").set('Cookie', 'gruwup-session=123').expect(200).then(res => {
            expect(res._body).toEqual(expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimestamp,
                city: "Test city",
                status: "OPEN",
                peopleGoing: ["Test User"]
            }));
        });
    });
});

describe("PUT /user/adventure/:adventureId/update", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/update").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/update").set('Cookie', 'gruwup-session=123').send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid adventure id");
        });
    });

    it("non-exist adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/" + ObjectId() + "/update").set('Cookie', 'gruwup-session=123').send().expect(404).then(res => {
            expect(res.text).toEqual("Adventure not found");
        });
    });

    it("valid adventure id", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
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
        await supertest(app).put("/user/adventure/" + adventure._id + "/update").set('Cookie', 'gruwup-session=123').send({
            title: "Test Adventure updated",
            description: "Test Adventure description updated",
            category: "MUSIC",
            location: "Test location updated, Test city updated",
            dateTime: futureTimestamp,
            city: "Test city updated",
            status: "CLOSED",
            peopleGoing: ["Test User"]
        }).expect(200).then(res => {
            expect(res._body).toEqual(expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure updated",
                description: "Test Adventure description updated",
                category: "MUSIC",
                location: "Test location updated, Test city updated",
                dateTime: futureTimestamp,
                city: "Test city updated",
                status: "CLOSED",
                peopleGoing: ["Test User"]
            }));
        });
    });
});

describe("put /user/adventure/:adventureId/cancel", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/cancel").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/cancel").set('Cookie', 'gruwup-session=123').send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid adventure id");
        });
    });

    it("non-exist adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/" + ObjectId() + "/cancel").set('Cookie', 'gruwup-session=123').send().expect(404).then(res => {
            expect(res.text).toEqual("Adventure not found");
        });
    });

    it("valid adventure id", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
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
        await supertest(app).put("/user/adventure/" + adventure._id + "/cancel").set('Cookie', 'gruwup-session=123').send().expect(200).then(res => {
            expect(res._body).toEqual(expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimestamp,
                city: "Test city",
                status: "CANCELLED",
                peopleGoing: ["Test User"]
            }));
        });
    });
});

describe("GET /user/adventure/:userId/get-adventures", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/123/get-adventures").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("valid user id", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure1 = await Adventure.create({
            owner: "TestUser1",
            title: "Test Adventure1",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["TestUser1", "TestUser2"]
        });
        const adventure2 = await Adventure.create({
            owner: "TestUser2",
            title: "Test Adventure2",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["TestUser2"]
        });
        await supertest(app).get("/user/adventure/TestUser2/get-adventures").set('Cookie', 'gruwup-session=123').send().expect(200).then(res => {
            expect(res._body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    owner: "TestUser2",
                    title: "Test Adventure2",
                    description: "Test Adventure description",
                    category: "MOVIE",
                    location: "Test location, Test city",
                    dateTime: futureTimestamp,
                    city: "Test city",
                    status: "OPEN",
                    peopleGoing: ["TestUser2"]
                }),
                expect.objectContaining({
                    owner: "TestUser2",
                    title: "Test Adventure2",
                    description: "Test Adventure description",
                    category: "MOVIE",
                    location: "Test location, Test city",
                    dateTime: futureTimestamp,
                    city: "Test city",
                    status: "OPEN",
                    peopleGoing: ["TestUser2"]
                })
            ]));
        });
    });
});

describe("PUT /user/adventure/:adventureId/quit", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/quit").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/123/quit?userId=123").set('Cookie', 'gruwup-session=123').send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid adventure id");
        });
    });

    it("missing user id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/" + ObjectId() + "/quit").set('Cookie', 'gruwup-session=123').send().expect(400).then(res => {
            expect(res.text).toEqual("User id is required");
        });
    });

    it("non-exist adventure id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/adventure/" + ObjectId() + "/quit?userId=123").set('Cookie', 'gruwup-session=123').send().expect(404).then(res => {
            expect(res.text).toEqual("Adventure not found");
        });
    });

    it("quite existing adventure", async () => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
            owner: "TestUser",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["TestUser"]
        });
        await supertest(app).put("/user/adventure/" + adventure._id + "/quit?userId=TestUser").set('Cookie', 'gruwup-session=123').send().expect(200).then(res => {
            expect(res.text).toEqual("Adventure deleted successfully");
        });
    });
});

describe("GET /user/adventure/nearby", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/adventure/nearby").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("call with city name", async() => {
        expect.assertions(1);
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
            owner: "TestUser",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["TestUser"]
        });
        await supertest(app).get("/user/adventure/nearby?city=Test city").set('Cookie', 'gruwup-session=123').send().expect(200).then(res => {
            expect(res._body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    owner: "TestUser",
                    title: "Test Adventure",
                    description: "Test Adventure description",
                    category: "MOVIE",
                    location: "Test location, Test city",
                    dateTime: futureTimestamp,
                    city: "Test city",
                    status: "OPEN",
                    peopleGoing: ["TestUser"]
                })
            ]));
        });
    });
});