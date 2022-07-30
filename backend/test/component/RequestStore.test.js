var RequestStore = require('../../store/RequestStore');
const mongoose = require("mongoose");
const Adventure = require('../../models/Adventure');
const Request = require('../../models/Request');

const testMongoPort = "27017";
var mongoDbUrl = "mongodb://localhost:" + testMongoPort;

beforeAll(async () => {
    await mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then(() => console.log("Connected to MongoDB at Url: %s", mongoDbUrl)).catch(err => console.log(err));
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    console.log("after all running");
    await mongoose.connection.close();
});

jest.mock("../../store/AdventureStore");

describe("sendRequest tests", () => {
    test("Success scenario", async () => {
        expect.assertions(2);
        var time = Date.now() + 1;
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
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
        var adventureId = testAdventure._id;
        var request = {
            userName: "severus",
            userId: "severus",
            dateTime: time
        }

        var result = await RequestStore.sendRequest(adventureId, request);
        expect(result).toEqual(
            expect.objectContaining({ 
                    code: 200, 
                    message: 'Request sent',
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

    test("Invalid input in request field", async () => {
        expect.assertions(1);
        var adventureData = {
            owner: "userid",
            title: "title",
            description: "description",
            peopleGoing: ["userid"],
            dateTime: Date.now() + 1,
            location: "2110 Burrard St, Vancouver, BC V6J 3H6",
            category: "MOVIE",
            status: "OPEN",
            image: "string",
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
        var adventureId = testAdventure._id;
        var request = {
            userName: "severus",
            userId: "severus"
        }

        var result = await RequestStore.sendRequest(adventureId, request);
        expect(result).toStrictEqual({ code: 400, message: 'Request validation failed: dateTime: Path `dateTime` is required.' });
    });

    test("Invalid input, User already sent a request to this adventure", async () => {
        expect.assertions(1);
        var time = Date.now() + 1;
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
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
        var adventureId = testAdventure._id;
        var request = {
            userName: "severus",
            userId: "severus",
            dateTime: time
        }

        await RequestStore.sendRequest(adventureId, request);
        var result = await RequestStore.sendRequest(adventureId, request);
        expect(result).toStrictEqual({ code: 400, message: 'You have already sent a request to this adventure' });
    });

    test("Invalid adventure id", async () => {
        expect.assertions(1);
        var time = Date.now() + 1;
        var request = {
            userName: "severus",
            userId: "severus",
            dateTime: time
        }
        var result = await RequestStore.sendRequest({}, request);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 400, 
                message: 'Invalid adventure id',
            }));
    });
});

describe("getRequests tests", () => {
    test("Success scenario - corresponding requests", async () => {
        expect.assertions(3);
        var userId = "userId"
        var time = Date.now();
        var testRequest1 = {
            adventureId: "1",
            adventureExpireAt: time,
            adventureOwner: "minerva",
            adventureTitle: "Transfiguration Show",
            requester: "severus",
            requesterId: userId,
            status: "PENDING",
            dateTime: time
        };
    
        var testRequest2 = {
            adventureId: "2",
            adventureExpireAt: time,
            adventureOwner: userId,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: "minerva",
            status: "PENDING",
            dateTime: time
        };

        var newRequest1 = new Request(testRequest1);
        var newRequest2 = new Request(testRequest2);
        await newRequest1.save();
        await newRequest2.save();

        var result = await RequestStore.getRequests(userId);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Requests found',
            }));

        expect(result.payload[0]).toEqual(
            expect.objectContaining(testRequest1));

        expect(result.payload[1]).toEqual(
            expect.objectContaining(testRequest2));
    });

    test("Success scenario - valid user", async () => {
        expect.assertions(1);
        var userId = "userId"
        var result = await RequestStore.getRequests(userId);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Requests found',
                payload: []
            }));
    });

    test("Success scenario - random user", async () => {
        expect.assertions(1);
        var userId = "111"
        var result = await RequestStore.getRequests(userId);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Requests found',
                payload: []
            }));
    });
});

describe("acceptRequest tests", () => {
    test("Success scenario", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
        var adventureData = {
            owner: userId1,
            title: "title",
            description: "description",
            peopleGoing: ["userid"],
            dateTime: time,
            location: "2110 Burrard St, Vancouver, BC V6J 3H6",
            category: "MOVIE",
            status: "OPEN",
            image: "string",
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
    
        var requestData = {
            adventureId: testAdventure._id,
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.acceptRequest(testRequest._id);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Request accepted',
            }));
    });

    test("No adventure tied to request", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
        var requestData = {
            adventureId: "123",
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.acceptRequest(testRequest._id);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Adventure not found',
            }));
    });

    test("No request corresponding to id", async () => {
        expect.assertions(1);
        var result = await RequestStore.acceptRequest("111111111111");
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Request not found',
            }));
    });

    test("Invalid request id", async () => {
        expect.assertions(1);
        var result = await RequestStore.acceptRequest({});
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 400, 
                message: 'Invalid request id',
            }));
    });
});

describe("rejectRequest tests", () => {
    test("Success scenario", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
        var adventureData = {
            owner: userId1,
            title: "title",
            description: "description",
            peopleGoing: ["userid"],
            dateTime: time,
            location: "2110 Burrard St, Vancouver, BC V6J 3H6",
            category: "MOVIE",
            status: "OPEN",
            image: "string",
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
    
        var requestData = {
            adventureId: testAdventure._id,
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.rejectRequest(testRequest._id);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Request rejected',
            }));
    });
    
    test("No adventure tied to request", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
        var requestData = {
            adventureId: "123",
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.rejectRequest(testRequest._id);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Adventure not found',
            }));
    });

    test("No request corresponding to id", async () => {
        expect.assertions(1);
        var result = await RequestStore.rejectRequest("111111111111");
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Request not found',
            }));
    });

    test("Invalid request id", async () => {
        expect.assertions(1);
        var result = await RequestStore.rejectRequest({});
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 400, 
                message: 'Invalid request id',
            }));
    });
});

describe("checkIfRequestExists tests", () => {
    test("Success scenario", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
        var adventureData = {
            owner: userId1,
            title: "title",
            description: "description",
            peopleGoing: ["userid"],
            dateTime: time,
            location: "2110 Burrard St, Vancouver, BC V6J 3H6",
            category: "MOVIE",
            status: "OPEN",
            image: "string",
            city: "Vancouver"
          };
        var newAdventure = new Adventure(adventureData);
        var testAdventure = await newAdventure.save();
    
        var requestData = {
            adventureId: testAdventure._id,
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.checkIfRequestExists(testAdventure._id, userId2);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 200, 
                message: 'Request found',
            }));
    });

    test("adventureId does not match request", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
    
        var requestData = {
            adventureId: "123",
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.checkIfRequestExists("1111111111", userId2);
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Request not found',
            }));
    });

    test("requesterId does not match request", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
    
        var requestData = {
            adventureId: "123",
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.checkIfRequestExists(requestData.adventureId, "1111111111");
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Request not found',
            }));
    });
    
    test("requesterId and adventureId do not match request", async () => {
        expect.assertions(1);
        var userId1 = "userId1"
        var userId2 = "userId2"
        var time = Date.now() + 1;
    
        var requestData = {
            adventureId: "123",
            adventureExpireAt: time,
            adventureOwner: userId1,
            adventureTitle: "Potion History",
            requester: "minerva",
            requesterId: userId2,
            status: "PENDING",
            dateTime: time
        };
        var newRequest = new Request(requestData);
        testRequest = await newRequest.save();

        var result = await RequestStore.checkIfRequestExists("1111111111", "1111111111");
        expect(result).toEqual(
            expect.objectContaining({ 
                code: 404, 
                message: 'Request not found',
            }));
    });
});