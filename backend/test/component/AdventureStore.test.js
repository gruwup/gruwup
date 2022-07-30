const AdventureStore = require("../../store/AdventureStore");
const Adventure = require("../..//models/Adventure");
const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;

const testMongoPort = "27384";
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

describe("createAdventure tests", () => {
    it("missing input", async () => {
        expect.assertions(1);
        expect(await AdventureStore.createAdventure()).toEqual({
            code: 400,
            message: "Adventure is required"
        });
    });

    it("input data missing required field", async () => {
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

    it("input data is illegal", async () => {
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

    it("success scenario", async () => {
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
    it("no adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.getAdventureDetail()).toEqual({
            code: 400,
            message: "Adventure id is required"
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.getAdventureDetail("123")).toEqual({
            code: 400,
            message: "Invalid adventure id"
        });
    });

    it("no adventure found", async () => {
        expect.assertions(1);
        expect(await AdventureStore.getAdventureDetail(ObjectId())).toEqual({
            code: 404,
            message: "Adventure not found"
        });
    });

    it("success scenario", async () => {
        expect.assertions(1);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventureId = await AdventureStore.createAdventure(adventure);
        expect(await AdventureStore.getAdventureDetail(adventureId.payload._id)).toEqual({
            code: 200,
            message: "Adventure found",
            payload: expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User"],
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            })
        });
    });
});

describe("updateAdventure tests", () => {
    it("no adventure id or adventure", async () => {
        expect.assertions(1);
        expect(await AdventureStore.updateAdventure()).toEqual({
            code: 400,
            message: "Adventure id is required"
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.updateAdventure("123", {})).toEqual({
            code: 400,
            message: "Invalid adventure id"
        });
    });

    it("no adventure found", async () => {
        expect.assertions(1);
        expect(await AdventureStore.updateAdventure(ObjectId(), {})).toEqual({
            code: 404,
            message: "Adventure not found"
        });
    });

    it("adventure data is illegal", async () => {
        expect.assertions(2);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventureId = await AdventureStore.createAdventure(adventure);
        const newAdventureData = {
            dateTime: 123
        };
        expect(await AdventureStore.updateAdventure(adventureId.payload._id, newAdventureData)).toEqual({
            code: 400,
            message: "Validation failed: dateTime: 123 dateTime cannot be in the past"
        });
        expect(await Adventure.findById(adventureId.payload._id)).toEqual(expect.objectContaining({
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
    });

    it("update title success scenario", async () => {
        expect.assertions(2);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventureCreated = await AdventureStore.createAdventure(adventure);
        const newAdventureData = {
            title: "New title"
        };
        expect(await AdventureStore.updateAdventure(adventureCreated.payload._id, newAdventureData)).toEqual({
            code: 200,
            message: "Adventure updated successfully",
            payload: expect.objectContaining({
                owner: "Test User",
                title: "New title",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User"],
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            })
        });
        expect(await Adventure.findById(adventureCreated.payload._id)).toEqual(expect.objectContaining({
            owner: "Test User",
            title: "New title",
            description: "Test Adventure description",
            category: "MOVIE",
            peopleGoing: ["Test User"],
            location: "Test location, Test city",
            dateTime: futureTimeStamp,
            city: "Test city",
            status: "OPEN"
        }));
    });

    it("update location success scenario", async () => {
        expect.assertions(2);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventureCreated = await AdventureStore.createAdventure(adventure);
        const newAdventureData = {
            location: "New location, New city"
        };
        expect(await AdventureStore.updateAdventure(adventureCreated.payload._id, newAdventureData)).toEqual({
            code: 200,
            message: "Adventure updated successfully",
            payload: expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User"],
                location: "New location, New city",
                dateTime: futureTimeStamp,
                city: "New city",
                status: "OPEN"
            })
        });
        expect(await Adventure.findById(adventureCreated.payload._id)).toEqual(expect.objectContaining({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            peopleGoing: ["Test User"],
            location: "New location, New city",
            dateTime: futureTimeStamp,
            city: "New city",
            status: "OPEN"
        }));
    });
});

describe("cancelAdventure tests", () => {
    it("no adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.cancelAdventure()).toEqual({
            code: 400,
            message: "Adventure id is required"
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.cancelAdventure("123")).toEqual({
            code: 400,
            message: "Invalid adventure id"
        });
    });

    it("no adventure found", async () => {
        expect.assertions(1);
        expect(await AdventureStore.cancelAdventure(ObjectId())).toEqual({
            code: 404,
            message: "Adventure not found"
        });
    });

    it("success scenario", async () => {
        expect.assertions(2);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventureCreated = await AdventureStore.createAdventure(adventure);
        expect(await AdventureStore.cancelAdventure(adventureCreated.payload._id)).toEqual({
            code: 200,
            message: "Adventure cancelled successfully",
            payload: expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User"],
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "CANCELLED"
            })
        });
        expect(await Adventure.findById(adventureCreated.payload._id)).toEqual(expect.objectContaining({
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            peopleGoing: ["Test User"],
            location: "Test location, Test city",
            dateTime: futureTimeStamp,
            city: "Test city",
            status: "CANCELLED"
        }));
    });    
});

describe("searchAdventuresByTitle tests", () => {
    it("no title input", async () => {
        expect.assertions(1);
        expect(await AdventureStore.searchAdventuresByTitle()).toEqual({
            code: 400,
            message: "Title is required"
        });
    });

    it("empty result success scenario", async () => {
        expect.assertions(1);
        expect(await AdventureStore.searchAdventuresByTitle("Test")).toEqual({
            code: 200,
            message: "Adventures found",
            payload: []
        });
    });

    it("non-empty result success scenario", async () => {
        expect.assertions(4);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure1 = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        const adventure2 = {
            owner: "Test User",
            title: "test Adventure",
            description: "Test Adventure description",
            category: "MUSIC",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        await AdventureStore.createAdventure(adventure1);
        await AdventureStore.createAdventure(adventure2);
        const result = await AdventureStore.searchAdventuresByTitle("Test");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(2);
        expect(result.payload).toEqual(expect.arrayContaining([
            expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            }),
            expect.objectContaining({
                owner: "Test User",
                title: "test Adventure",
                description: "Test Adventure description",
                category: "MUSIC",
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            })
        ]));
    });
});

describe("getUsersAdventures tests", () => {
    it("no user id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.getUsersAdventures()).toEqual({
            code: 400,
            message: "User id is required"
        });
    });

    it("invalid user id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.getUsersAdventures("123")).toEqual({
            code: 200,
            message: "Adventures found",
            payload: []
        });
    });

    it("user does not own or participate in any adventure", async () => {
        expect.assertions(3);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventure = {
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            category: "MOVIE",
            location: "Test location, Test city",
            dateTime: futureTimeStamp
        };
        await AdventureStore.createAdventure(adventure);
        const result = await AdventureStore.getUsersAdventures("Test User2");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(0);
    });

    it("none empty result success scenario - user as owner", async () => {
        expect.assertions(4);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.getUsersAdventures("Test User");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(1);
        expect(result.payload).toEqual(expect.arrayContaining([
            expect.objectContaining({
                owner: "Test User",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User"],
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            })
        ]));
    });

    it("none empty result success scenario - user as participant", async () => {
        expect.assertions(4);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1", "Test User2"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.getUsersAdventures("Test User2");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(1);
        expect(result.payload).toEqual(expect.arrayContaining([
            expect.objectContaining({
                owner: "Test User1",
                title: "Test Adventure",
                description: "Test Adventure description",
                category: "MOVIE",
                peopleGoing: ["Test User1", "Test User2"],
                location: "Test location, Test city",
                dateTime: futureTimeStamp,
                city: "Test city",
                status: "OPEN"
            })
        ]));
    });
});

describe("removeAdventureParticipant tests", () => {
    it("no user id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.removeAdventureParticipant("123")).toEqual({
            code: 400,
            message: "User id is required"
        });
    });

    it("invalid adventure id", async () => {
        expect.assertions(1);
        expect(await AdventureStore.removeAdventureParticipant("123", "123")).toEqual({
            code: 400,
            message: "Invalid adventure id"
        });
    });

    it("no adventure found", async () => {
        expect.assertions(1);
        expect(await AdventureStore.removeAdventureParticipant(ObjectId(), "123")).toEqual({
            code: 404,
            message: "Adventure not found"
        });
    });

    it("user to be deleted is the only participant and owner", async () => {
        expect.assertions(3);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.removeAdventureParticipant(newAdventure._id, "Test User");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventure deleted successfully");
        var searchResult = await Adventure.find();
        expect(searchResult.length).toEqual(0);
    });

    it("user to be deleted is not the owner of adventure and not the only participant", async () => {
        expect.assertions(3);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1", "Test User2"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.removeAdventureParticipant(newAdventure._id, "Test User2");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Removed participant successfully");
        expect(await Adventure.findById(newAdventure._id)).toEqual(expect.objectContaining({
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        }));
    });

    it("user to be deleted is the owner of adventure but not the only participant", async () => {
        expect.assertions(3);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1", "Test User2"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.removeAdventureParticipant(newAdventure._id, "Test User1");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Removed owner successfully, new owner is Test User2");
        expect(await Adventure.findById(newAdventure._id)).toEqual(expect.objectContaining({
            owner: "Test User2",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User2"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        }));
    });

    it("user to be deleted is not a participant", async () => {
        expect.assertions(3);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData = {
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure = new Adventure(adventureData);
        await newAdventure.save();
        const result = await AdventureStore.removeAdventureParticipant(newAdventure._id, "Test User2");
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Removed participant successfully");
        expect(await Adventure.findById(newAdventure._id)).toEqual(expect.objectContaining({
            owner: "Test User1",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User1"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        }));
    });
});

describe("findAdventuresByFilter tests", () => {
    it("filter field does not belong to any of the maxTimestamp, maxPeopleGoing, city, or cagetories", async () => {
        expect.assertions(5);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData1 = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        const adventureData2 = {
            owner: "Test User",
            title: "Test Adventure2",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        var newAdventure1 = new Adventure(adventureData1);
        var newAdventure2 = new Adventure(adventureData2);
        await newAdventure1.save();
        await newAdventure2.save();
        const result = await AdventureStore.findAdventuresByFilter({test: "123"});
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(2);
        expect(result.payload[0].status).toEqual("OPEN");
        expect(result.payload[1].status).toEqual("OPEN");
    });

    it("valid filter on city", async () => {
        expect.assertions(5);
        const futureTimeStamp = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).getTime();
        const adventureData1 = {
            owner: "Test User",
            title: "Test Adventure",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location, Test city",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city"
        };
        const adventureData2 = {
            owner: "Test User",
            title: "Test Adventure2",
            description: "Test Adventure description",
            peopleGoing: ["Test User"],
            dateTime: futureTimeStamp,
            location: "Test location2, Test city2",
            category: "MOVIE",
            status: "OPEN",
            city: "Test city2"
        };
        var newAdventure1 = new Adventure(adventureData1);
        var newAdventure2 = new Adventure(adventureData2);
        await newAdventure1.save();
        await newAdventure2.save();
        const result = await AdventureStore.findAdventuresByFilter({city: "Test city"});
        expect(result.code).toEqual(200);
        expect(result.message).toEqual("Adventures found");
        expect(result.payload.length).toEqual(1);
        expect(result.payload[0].status).toEqual("OPEN");
        expect(result.payload[0].city).toEqual("Test city");
    });
});