const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Profile = require("../../models/Profile");

const testMongoPort = "27017";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB at Url: %s", mongoDbUrl)).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /user/profile/create", () => {
    it("Create profile with userId not corresponding to an existing user", async () => {
        await supertest(app).post("/user/profile/create")
        .set("Cookie", "gruwup-session=123")
        .send({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(200);

        await Profile.findOne({ userId: "12345" }).then(async profileResult => {
            expect(profileResult).toBeTruthy();
            expect(profileResult.userId).toBe("12345");
            expect(profileResult.name).toBe("Test");
            expect(profileResult.biography).toBe("Test");
            expect(profileResult.categories).toEqual(["MOVIE", "MUSIC", "SPORTS"]);
        });
    });

    it("Create profile with invalid input fields", async () => {
        await supertest(app).post("/user/profile/create")
        .set("Cookie", "gruwup-session=123")
        .send({
            userId: "12345",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(400).then(res => {
            expect(res.text).toBe('Profile validation failed');
        });
    });

    it("Create profile with userId that corresponds to an existing user", async ()=> {
        const profile = new Profile({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        });
        await profile.save();

        await supertest(app).post("/user/profile/create")
            .set("Cookie", "gruwup-session=123")
            .send({
                userId: "12345",
                name: "Test",
                biography: "Test",
                categories: ["MOVIE", "MUSIC", "SPORTS"]
            }).expect(400).then(res => {
                expect(res.text).toBe("Profile exists for userId");
            });
    });

    it("Create profile with invalid session cookie", async () => {
        await supertest(app).post("/user/profile/create")
        .send({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
});

describe("GET /user/profile/:userId/get", () => {
    it("Get existing profile that corresponds to userId", async () => {
        const profile = new Profile({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        });
        await profile.save();

        await supertest(app).get("/user/profile/12345/get")
        .set("Cookie", "gruwup-session=123")
        .expect(200).then(res => {
            expect(res.body.userId).toBe("12345");
            expect(res.body.name).toBe("Test");
            expect(res.body.biography).toBe("Test");
            expect(res.body.categories).toEqual(["MOVIE", "MUSIC", "SPORTS"]);
        });
    });

    it("Get a non-existent profile using userId", async () => {
        await supertest(app).get("/user/profile/12345/get")
        .set("Cookie", "gruwup-session=123")
        .expect(404).then(res => {
            expect(res.text).toBe("User Profile not found");
        });
    });

    it("Get profile with invalid session cookie", async () => {
        await supertest(app).get("/user/profile/12345/get")
        .expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
});

describe("PUT /user/profile/:userId/edit", () => {
    it("Edit existing profile that corresponds to userId and with valid profile inputs", async () => {
        const profile = new Profile({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        });
        await profile.save();

        await supertest(app).put("/user/profile/12345/edit")
        .set("Cookie", "gruwup-session=123")
        .send({
            name: "Test2",
            biography: "Test2",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(200);

        await Profile.findOne({ userId: "12345" }).then(profileResult => {
            expect(profileResult).toBeTruthy();
            expect(profileResult.userId).toBe("12345");
            expect(profileResult.name).toBe("Test2");
            expect(profileResult.biography).toBe("Test2");
            expect(profileResult.categories).toEqual(["MOVIE", "MUSIC", "SPORTS"]);
        });
    });

    it("Edit profile with invalid input fields", async () => {
        const profile = new Profile({
            userId: "12345",
            name: "Test",
            biography: "Test",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        });
        await profile.save();

        await supertest(app).put("/user/profile/12345/edit")
        .set("Cookie", "gruwup-session=123")
        .send({
            biography: "Test2",
            categories: ["LEO", "MOVIE", "MUSIC", "SPORTS"]
        }).expect(400).then(res => {
            expect(res.text).toBe('Validation failed');
        });
    });

    it("Edit existing profile that corresponds to userId and with invalid profile inputs", async() => {
        await supertest(app).put("/user/profile/12345/edit")
        .set("Cookie", "gruwup-session=123")
        .send({
            name: "Test2",
            biography: "Test2",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(404).then(res => {
            expect(res.text).toBe("User Profile not found");
        });
    });

    it("Edit profile with invalid session cookie", async () => {
        await supertest(app).put("/user/profile/12345/edit")
        .send({
            name: "Test2",
            biography: "Test2",
            categories: ["MOVIE", "MUSIC", "SPORTS"]
        }).expect(403).then(res => {
            expect(res._body.message).toEqual("Invalid cookie");
        });
    });
});