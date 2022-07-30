const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Adventure = require("../../models/Adventure");
const Request = require("../../models/Request");
const { ObjectId } = require("mongodb");
const TestSessions = require("../TestSessions");

const testMongoPort = "27384";
const PORT = "8081"
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;
var cookie, server;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => {
        console.log("Connected to MongoDB at Url: %s", mongoDbUrl)
        server = app.listen(PORT, (req, res) => {
            var host = server.address().address;
            var port = server.address().port;
            console.log("App listening at http://%s:%s", host, port);
        });
    }).catch(err => console.log(err));
    cookie = await TestSessions.getSessionCookie();
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe("POST /user/request/:adventureId/send-request", () => {
    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/request/123/send-request").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("call with invalid adventureId", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/request/123/send-request").set('Cookie', cookie).send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid adventure id");
        });
    });

    it("request to non-existing adventure", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/request/" + ObjectId() + "/send-request").set('Cookie', cookie).send().expect(404).then(res => {
            expect(res.text).toEqual("Adventure not found");
        });
    });

    it("request to a no longer opened adventure", async () => {
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
            status: "CLOSED",
            peopleGoing: ["Test User"]
        });
        await supertest(app)
            .post("/user/request/" + adventure._id + "/send-request")
            .set('Cookie', cookie)
            .send({
                "userId": "Test User",
                "userName": "Test User",
                dateTime: (futureTimestamp - 1000)
            })
            .expect(400)
            .then(res => {
            expect(res.text).toEqual("Adventure is not open");
        });
    });

    it("request to join adventure user owns", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User"]
        });
        await supertest(app)
            .post("/user/request/" + adventure._id + "/send-request")
            .set('Cookie', cookie)
            .send({
                "userId": "Test User",
                "userName": "Test User",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
            })
            .expect(400)
            .then(res => {
            expect(res.text).toEqual("You can't request to your own adventure");
        });
    });

    it("request duplicate", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User1"]
        });

        await Request.create({
            adventureId: adventure._id,
            adventureOwner: "Test User1",
            adventureTitle: "Test Adventure",
            requester: "Test User2",
            requesterId: "Test User2",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: adventure.dateTime,
            status: "PENDING"
        });

        await supertest(app)
            .post("/user/request/" + adventure._id + "/send-request")
            .set('Cookie', cookie)
            .send({
                "userId": "Test User2",
                "userName": "Test User2",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
            })
            .expect(400)
            .then(res => {
            expect(res.text).toEqual("You have already sent a request to this adventure");
        });
    });

    it("invalid request data", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User1"]
        });

        await supertest(app)
            .post("/user/request/" + adventure._id + "/send-request")
            .set('Cookie', cookie)
            .send({
                "userId": "Test User",
                "userName": "Test User2"
            })
            .expect(400)
            .then(res => {
            expect(res.text).toEqual("Request validation failed: dateTime: Path `dateTime` is required.");
        });
    });

    it("sending valid request", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Test User1"]
        });

        await supertest(app)
            .post("/user/request/" + adventure._id + "/send-request")
            .set('Cookie', cookie)
            .send({
                "userId": "Test User",
                "userName": "Test User2",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
            })
            .expect(200)
            .then(res => {
            expect(res.text).toEqual("Request sent");
        });
    });
});

describe("GET /user/request/:userId/get-requests", () => {
    it("calling with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/request/123/get-requests").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("get request for user", async () => {
        await Request.create({
            adventureId: ObjectId(),
            adventureOwner: "Test User1",
            adventureTitle: "Test Adventure",
            requester: "Test User2",
            requesterId: "Test User2",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: new Date().getTime() + 1000 * 60 * 60 * 24,
            status: "PENDING"
        });

        await Request.create({
            adventureId: ObjectId(),
            adventureOwner: "Test User2",
            adventureTitle: "Test Adventure",
            requester: "Test User3",
            requesterId: "Test User3",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: new Date().getTime() + 1000 * 60 * 60 * 24,
            status: "PENDING"
        });

        await Request.create({
            adventureId: ObjectId(),
            adventureOwner: "Test User2",
            adventureTitle: "Test Adventure",
            requester: "Test User4",
            requesterId: "Test User4",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: new Date().getTime() + 1000 * 60 * 60 * 24,
            status: "REJECTED"
        });

        await supertest(app)
            .get("/user/request/Test User2/get-requests")
            .set('Cookie', cookie)
            .then(res => {
                expect(res._body.requests.length).toEqual(2);
                res._body.requests.forEach(request => {
                    expect(request.requester === "Test User2" || request.adventureOwner === "Test User2").toBeTruthy();
                    expect(request.status).toEqual("PENDING");
                });
            });
    });
});

describe("PUT /user/request/:requestId/accept", () => {
    it("calling with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/123/accept").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("calling with invalid request id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/123/accept").set('Cookie', cookie).send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid request id");
        });
    });

    it("calling with non-exit request id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/" + ObjectId() + "/accept").set('Cookie', cookie).send().expect(404).then(res => {
            expect(res.text).toEqual("Request not found");
        });
    });

    it("accept valid request turns its status to accepted", async () => {
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "CLOSED",
            peopleGoing: ["Test User"]
        });

        const request = await Request.create({
            adventureId: adventure._id,
            adventureOwner: "Test User1",
            adventureTitle: "Test Adventure",
            requester: "Test User2",
            requesterId: "Test User2",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: new Date().getTime() + 1000 * 60 * 60 * 24,
            status: "PENDING"
        });

        await supertest(app)
            .put("/user/request/" + request._id + "/accept")
            .set('Cookie', cookie)
            .expect(200)
            .then(res => {
                expect(res.text).toEqual("Request accepted");
            });
        
        const updatedRequest = await Request.findById(request._id);
        expect(updatedRequest.status).toEqual("ACCEPTED");

        const updatedAdventure = await Adventure.findById(adventure._id);
        expect(updatedAdventure.peopleGoing).toContain("Test User2");
    });
});

describe("PUT /user/request/:requestId/reject", () => {
    it("calling with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/123/reject").send().expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });

    it("calling with invalid request id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/123/reject").set('Cookie', cookie).send().expect(400).then(res => {
            expect(res.text).toEqual("Invalid request id");
        });
    });

    it("calling with non-exit request id", async () => {
        expect.assertions(1);
        await supertest(app).put("/user/request/" + ObjectId() + "/reject").set('Cookie', cookie).send().expect(404).then(res => {
            expect(res.text).toEqual("Request not found");
        });
    });

    it("reject valid request turns its status to rejected", async () => {
        const futureTimestamp = new Date().getTime() + 1000 * 60 * 60 * 24;
        const adventure = await Adventure.create({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimestamp,
            city: "Test city",
            status: "CLOSED",
            peopleGoing: ["Test User"]
        });

        const request = await Request.create({
            adventureId: adventure._id,
            adventureOwner: "Test User1",
            adventureTitle: "Test Adventure",
            requester: "Test User2",
            requesterId: "Test User2",
            dateTime: new Date().getTime() + 1000 * 60 * 60,
            adventureExpireAt: new Date().getTime() + 1000 * 60 * 60 * 24,
            status: "PENDING"
        });

        await supertest(app)
            .put("/user/request/" + request._id + "/reject")
            .set('Cookie', cookie)
            .expect(200)
            .then(res => {
                expect(res.text).toEqual("Request rejected");
            });
        
        const updatedRequest = await Request.findById(request._id);
        expect(updatedRequest.status).toEqual("REJECTED");

        const updatedAdventure = await Adventure.findById(adventure._id);
        expect(updatedAdventure.peopleGoing).not.toContain("Test User2");
    });
});