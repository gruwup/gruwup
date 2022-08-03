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
        city: "Vancouver"
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
        city: "Vancouver"
    };

    static testRequest1 = {
        _id: "10",
        adventureId: "10",
        adventureOwner: "Spongebob Squarepants",
        adventureTitle: "Krabby Patty Cooking Class",
        requester: "Plankton",
        requesterId: "123",
        status: "PENDING",
        dateTime: "1887602211",
        __v: 0
    };

    static testRequest2 = {
        _id: "20",
        adventureId: "20",
        adventureOwner: "Bob the builder",
        adventureTitle: "Construction time",
        requester: "person",
        requesterId: "123",
        status: "PENDING",
        dateTime: "1887602991",
        __v: 0
    }

    static testRequest3 = {
        _id: "1",
        adventureId: "1",
        adventureOwner: "minerva",
        adventureTitle: "Transfiguration Show",
        requester: "severus",
        requesterId: "severus",
        status: "PENDING",
        dateTime: "1887602251",
        __v: 0
    };

    static testRequest4 = {
        _id: "2",
        adventureId: "2",
        adventureOwner: "severus",
        adventureTitle: "Potion History",
        requester: "minerva",
        requesterId: "minerva",
        status: "PENDING",
        dateTime: "1887602981",
        __v: 0
    }

    static testProfile1 = {
        _id: "62d8c985b530168dad13b8a8",
        userId: "102725629585412345678",
        name: "Bob John",
        biography: "tis lit",
        categories: ["ART", "MOVIE", "SPORTS", "FOOD"],
        image: "randomlink",
        __v: 0
    }

    static testProfile2 = {
        _id: "1",
        userId: "1",
        name: "HEHEXD",
        biography: "I love this class",
        categories: null,
        image: "randomlink",
        __v: 0
    }
}