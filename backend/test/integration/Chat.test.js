const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Adventure = require("../../models/Adventure");
const Profile = require("../../models/Profile");
const Message = require("../../models/Message");
const ChatSocket = require("../../services/ChatSocket");

const testMongoPort = "27384";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
    ChatSocket.runChat();
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /user/chat/:adventureId/send", () => {
    it("send message with valid data", async () => {
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

        await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .post("/user/chat/" + adventure._id + "/send")
            .set('Cookie', 'gruwup-session=123')
            .send({
                userId: "Test User",
                name: "Test User",
                message: "Test message",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
        }).expect(200)
        .then(res => {
            expect(res.text).toEqual("OK");
        });
    });

    it("send message with invalid data", async () => {
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

        await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .post("/user/chat/" + adventure._id + "/send")
            .set('Cookie', 'gruwup-session=123')
            .send({
                userId: "Test User",
                name: "Test User",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
        }).expect(400)
        .then(res => {
            expect(JSON.parse(res.text).message).toEqual("Message validation failed");
        });
    });

    it("send message to non-existent adventure", async () => {
        expect.assertions(1);

        await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .post("/user/chat/123123/send")
            .set('Cookie', 'gruwup-session=123')
            .send({
                userId: "Test User",
                name: "Test User",
                message: "Test message",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
        }).expect(400)
        .then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid adventure id");
        });
    });

    it("send message to adventure with non-existing user", async () => {
        expect.assertions(1);

        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        await supertest(app)    
            .post("/user/chat/" + adventure._id + "/send")
            .set('Cookie', 'gruwup-session=123')
            .send({
                userId: "Test User",
                name: "Test User",
                message: "Test message",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
        }).expect(400)
        .then(res => {
            expect(JSON.parse(res.text).message).toEqual("User is not participant of adventure");
        });
    });

    it("send message with existent adventure user is not participant of", async () => {
        expect.assertions(1);

        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .post("/user/chat/" + adventure._id + "/send")
            .set('Cookie', 'gruwup-session=123')
            .send({
                userId: "Test User",
                name: "Test User",
                message: "Test message",
                dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
        }).expect(400)
        .then(res => {
            expect(JSON.parse(res.text).message).toEqual("User is not participant of adventure");
        });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).post("/user/chat/123/send").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/chat/:userid/recent-list", () => {
    it("Get recent list but user is not participant of any adventures", async () => {
        expect.assertions(1);
        await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .get("/user/chat/" + user.userId +"/recent-list")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(JSON.parse(res.text).messages).toEqual([]);
            });
    });

    it("Get recent list but user is not participant of any adventures with messages in them", async () => {
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

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .get("/user/chat/" + user.userId +"/recent-list")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(JSON.parse(res.text).messages).toEqual(
                    [{
                        adventureId: adventure._id.toString(),
                        adventureTitle: adventure.title,
                        dateTime: "",
                        message: "",
                        name: "",
                        userId: ""
                    }]
                );
            });
    });

    it("Get recent list and user is participant of adventures with messages", async () => {
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

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .get("/user/chat/" + user.userId +"/recent-list")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(JSON.parse(res.text).messages).toEqual(
                    [{
                        adventureId: adventure._id.toString(),
                        adventureTitle: adventure.title,
                        dateTime: adventure.dateTime.toString(),
                        message: "test message",
                        name: user.name,
                        userId: user.userId
                    }]
                );
            });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/chat/123/recent-list").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/chat/:adventureId/recent-pagination", () => {
    it("Get recent pagination with adventure and corresponding messages", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .get("/user/chat/" + adventure._id +"/recent-pagination")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(JSON.parse(res.text).pagination).toEqual(adventure.dateTime.toString());
            });
    });

    it("Get recent pagination with adventure with no messages", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .get("/user/chat/" + adventure._id +"/recent-pagination")
            .set('Cookie', 'gruwup-session=123')
            .expect(404)
            .then(res => {
                expect(JSON.parse(res.text).message).toEqual("No previous messages found");
            });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/chat/123/recent-pagination").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/chat/:adventureId/messages/:pagination", () => {
    it("Get messages with valid adventure and valid pagination", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        const message = await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .get("/user/chat/" + adventure._id +"/messages/" + adventure.dateTime)
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(res._body).toEqual({
                    __v: 0,
                    _id: message._id.toString(),
                    adventureId: adventure._id.toString(),
                    pagination: adventure.dateTime.toString(),
                    prevPagination: null,
                    messages: [{
                        _id: message.messages[0]._id.toString(),
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime.toString()
                    }]
                });
            });
    });

    it("Get messages with valid adventure and invalid pagination", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .get("/user/chat/" + adventure._id +"/messages/123")
            .set('Cookie', 'gruwup-session=123')
            .expect(404)
            .then(res => {
                expect(JSON.parse(res.text).message).toEqual("Messages not found");
            });
    });

    it("Get messages with valid adventure and invalid pagination", async () => {
        expect.assertions(1);
        const adventure = await Adventure.create({
            owner: "Random User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: new Date().getTime() + 1000 * 60 * 60 * 24,
            city: "Test city",
            status: "OPEN",
            peopleGoing: ["Random User"]
        });

        const user = await Profile.create({
            userId: "Test User",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: user.userId,
                        name: user.name,
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .get("/user/chat/123/messages/" + adventure.dateTime)
            .set('Cookie', 'gruwup-session=123')
            .expect(404)
            .then(res => {
                expect(JSON.parse(res.text).message).toEqual("Messages not found");
            });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).get("/user/chat/123/messages/123").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/chat/:adventureId/delete-chat", () => {
    it("Delete chat for existing adventure", async () => {
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

        await Message.create({
            adventureId: adventure._id,
            pagination: adventure.dateTime,
            prevPagination: null,
            messages: [{
                        userId: "Test user",
                        name: "Test user",
                        message: "test message",
                        dateTime: adventure.dateTime
                    }]
        });

        await supertest(app)    
            .delete("/user/chat/" + adventure._id + "/delete-chat")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(res.text).toEqual("OK");
            });
    });

    it("Delete chat for non-existent adventure", async () => {
        expect.assertions(1);

        const message = await Message.create({
            adventureId: "123",
            pagination: new Date().getTime() + 1000 * 60 * 60 * 24,
            prevPagination: null,
            messages: [{
                        userId: "Test user",
                        name: "Test user",
                        message: "test message",
                        dateTime: new Date().getTime() + 1000 * 60 * 60 * 24
                    }]
        });

        await supertest(app)    
            .delete("/user/chat/" + message.adventureId + "/delete-chat")
            .set('Cookie', 'gruwup-session=123')
            .expect(200)
            .then(res => {
                expect(res.text).toEqual("OK");
            });
    });

    it("Delete chat for adventure with no messages", async () => {
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
            .delete("/user/chat/" + adventure._id + "/delete-chat")
            .set('Cookie', 'gruwup-session=123')
            .expect(404)
            .then(res => {
                expect(JSON.parse(res.text).message).toEqual("Messages not found");
            });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).delete("/user/chat/123/delete-chat").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});