const app = require("../../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Profile = require("../../models/Profile");
const TestSessions = require("../TestSessions");

const testMongoPort = "27017";
const PORT = "8081"
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;
var token, cookie, server;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => {
        console.log("Connected to MongoDB at Url: %s", mongoDbUrl)
        server = app.listen(PORT, (req, res) => {
            var host = server.address().address;
            var port = server.address().port;
            console.log("App listening at http://%s:%s", host, port);
        });
    }).catch(err => console.log(err));
    token = await TestSessions.generateTestToken();
    cookie = await TestSessions.getSessionCookie();
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
});

describe("POST /account/sign-in", () => {
    it("sign in for exising user", async () => {
        expect.assertions(1);
        await Profile.create({
            userId: "102054894045485647180",
            name: "Test User",
            biography: "I am a 20 year old living in Vancouver",
            categories: ["MOVIE", "MUSIC"],
            image: "imagegivenbygoogle.com"
        });

        await supertest(app)    
            .post("/account/sign-in")
            .send({
                authentication_code: token,
                client_id: TestSessions.client_id
              })
            .expect(200)
            .then(res => {
                expect(JSON.parse(res.text)).toEqual({
                    userId: "102054894045485647180",
                    userExists: true
                });
            });
    });

    it("sign in for non-exising user", async () => {
        expect.assertions(1);
        await supertest(app)    
            .post("/account/sign-in")
            .send({
                authentication_code: token,
                client_id: TestSessions.client_id
              })
            .expect(404)
            .then(res => {
                expect(JSON.parse(res.text)).toEqual({
                    userId: "102054894045485647180",
                    userExists: false
                });
            });
    });

    it("sign in with invalid credentials", async () => {
        await supertest(app).post("/account/sign-in").send({
            authentication_code: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA3NGI5MjhlZGY2NWE2ZjQ3MGM3MWIwYTI0N2JkMGY3YTRjOWNjYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2ODk5NTY1MjExODAtcms1dGg5MDZucjNrNWgxbWJvMGc1aXJhY2RnMTU2OHEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2ODk5NTY1MjExODAtZWwxdmZscGY3bHVrYWM5NXA0dTRzNTdxdjg0b3E0NmwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI4NTczMzAyOTM0MDk5MTg5MTQiLCJlbWFpbCI6Inlhc3VvY2FycnkyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImJvYiBsZWUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FGZFp1Y29lZlZLYUlmb3dnV2hvMUZZTkc3SHl5MUxFUjNOdWljWDk5c3lHPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImJvYiIsImZhbWlseV9uYW1lIjoibGVlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTg5ODEyNTksImV4cCI6MTY1ODk4NDg1OX0.dkjKX2cdSmRPtrkm0aXUBqLD9M6reOr91GX9lKxzgYmTkK9WOB7WoBPlpXKxNv-bB9Z9L9wwaEFJDtusuZT37ic0yY-YJtBQDuAW7fyS5BFdSz8vLxWqp4A7NC94ezwnRM_kFer0VNx7D3b1vx-xcMbMl4QtEN20j58Yss3G-ogw-kWMiRWHVvHCkuaZyZbZPqA7rzv8pp22lLVcvcBtpJ8NSkuJIj6cHMzWEm72Qj3cEnQf7vtbKwRP7SC3IKwIW4Vp_9CN6OwcVl35FDsJIR4RGTqhGjQa1yzclXIyP4j7dq4qrtWqNP-UeT4uYS5uEn8s1xNpNBq1puZhmHc08g",
            client_id: "689956521180-el1vflpf7lukac95p4u4s57qv84oq46l.apps.googleusercontent.com"
        }).expect(400).then(res => {
            expect(JSON.parse(res.text).message);
        });
    });
});

describe("POST /account/sign-out", () => {
    it("sign out with valid cookie", async () => {
        expect.assertions(1);
        await supertest(app)    
            .post("/account/sign-out")
            .set('Cookie', cookie)
            .send()
            .expect(200)
            .then(res => {
                expect(res.text).toEqual("OK");
            });
    });

    it("call with invalid cookie", async () => {
        expect.assertions(1);
        await supertest(app).post("/account/sign-out").send().expect(403).then(res => {
            expect(JSON.parse(res.text).message).toEqual("Invalid cookie");
        });
    });
});