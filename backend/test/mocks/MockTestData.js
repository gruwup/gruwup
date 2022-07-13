const { ObjectId } = require("mongodb");

module.exports = class MockTestData {
    static testAdventure1 = {
        _id: "1",
        owner: "minerva",
        title: "Transfiguration Show",
        description: "Transfiguration",
        category: "ART",
        peopleGoing: ["minerva"],
        dateTime: "1907602251",
        image: "Test image",
        location: "Adventure location, London",
        status: "OPEN",
        city: "London"
    };

    static testAdventure2 = {
        _id: "2",
        owner: "severus",
        title: "Potion History",
        description: "Potion",
        category: "MOVIE",
        peopleGoing: ["severus"],
        dateTime: "1907602981",
        image: "Test image",
        location: "Adventure location, London",
        status: "OPEN",
        city: "London"
    };

    static testRequest1 = {
        _id: new ObjectId("1"),
        adventureId: "1",
        adventureOwner: "minerva",
        adventureTitle: "Transfiguration Show",
        requester: "severus",
        requesterId: "severus",
        status: "PENDING",
        dateTime: "1887602251",
        __v: 0
    };

    static testRequest2 = {
        _id: new ObjectId("2"),
        adventureId: "2",
        adventureOwner: "severus",
        adventureTitle: "Potion History",
        requester: "minerva",
        requesterId: "minerva",
        status: "PENDING",
        dateTime: "1887602981",
        __v: 0
    }
}