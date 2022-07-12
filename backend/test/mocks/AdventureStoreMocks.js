const testAdventure1 = {
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

const testAdventure2 = {
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
}

module.exports = class AdventureStoreMocks {
    static createAdventure = jest.fn(() => {
        return {
            code: 200,
            message: "Adventure created successfully",
            payload: testAdventure1
        };
    }); 

    static getAdventureDetail = jest.fn((adventureId) => {
        return {
            code: 200,
            message: "Adventure found",
            payload: testAdventure1
        };
    });

    static updateAdventure = jest.fn((adventureId, adventure) => {
        return {
            code: 200,
            message: "Adventure updated successfully",
            payload: testAdventure1
        };
    });

    static cancelAdventure = jest.fn((adventureId) => {
        var cancelledAdventure = testAdventure1;
        cancelledAdventure.status = "CANCELLED";
        return {
            code: 200,
            message: "Adventure cancelled successfully",
            payload: cancelledAdventure
        };
    });

    static searchAdventuresByTitle = jest.fn((title) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                testAdventure1,
                testAdventure2
            ]
        }
    });

    static getUsersAdventures = jest.fn((userId) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                testAdventure1,
                testAdventure2
            ]
        }
    });

    static removeAdventureParticipant = jest.fn((adventureId, userId) => {
        return {
            code: 200,
            message: "Adventure participant removed successfully"
        };  
    });

    static findAdventuresByFilter = jest.fn((filter) => {
        return {
            code: 200,
            message: "Adventures found",
            payload: [
                testAdventure1,
                testAdventure2
            ]
        }
    });
};