var AdventureStoreMocks = require('./mocks/AdventureStoreMocks');
var FilterServiceMocks = require('./mocks/FilterServiceMocks');
var RequestStoreMocks = require('./mocks/RequestStoreMocks');
var UserStoreMocks = require('./mocks/UserStoreMocks');
var MockTestData = require('./mocks/MockTestData');

// AdventureStoreMocks tests
test('createAdventure', () => {
    expect(AdventureStoreMocks.createAdventure({})).toEqual({
        code: 200,
        message: "Adventure created successfully",
        payload: MockTestData.testAdventure1
    });
});

test('getAdventureDetail', () => {
    expect(AdventureStoreMocks.getAdventureDetail("")).toEqual({
        code: 200,
        message: "Adventure found",
        payload: MockTestData.testAdventure1
    });
});

test('updateAdventure', () => {
    expect(AdventureStoreMocks.updateAdventure("", {})).toEqual({
        code: 200,
        message: "Adventure updated successfully",
        payload: MockTestData.testAdventure1
    });
});

test('cancelAdventure', () => {
    var cancelledAdventure = MockTestData.testAdventure1;
    cancelledAdventure.status = "CANCELLED";
    expect(AdventureStoreMocks.cancelAdventure("")).toEqual({
        code: 200,
        message: "Adventure cancelled successfully",
        payload: cancelledAdventure
    });
});

test('searchAdventuresByTitle', () => {
    expect(AdventureStoreMocks.searchAdventuresByTitle("")).toEqual({
        code: 200,
        message: "Adventures found",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

test('getUsersAdventures', () => {
    expect(AdventureStoreMocks.getUsersAdventures("")).toEqual({
        code: 200,
        message: "Adventures found",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

test('removeAdventureParticipant', () => {
    expect(AdventureStoreMocks.removeAdventureParticipant("", "")).toEqual({
        code: 200,
        message: "Adventure participant removed successfully"
    });
});

test('findAdventuresByFilter', () => {
    expect(AdventureStoreMocks.findAdventuresByFilter({})).toEqual({
        code: 200,
        message: "Adventures found",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

// FilterServiceMocks tests
test('getNearbyAdventures', () => {
    expect(FilterServiceMocks.getNearbyAdventures("")).toEqual({
        code: 200,
        message: "Nearby adventures found",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

test('getRecommendationFeed', () => {
    expect(FilterServiceMocks.getRecommendationFeed("")).toEqual({
        code: 200,
        message: "Recommendation feed generated",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

test('getAdventuresByFilter', () => {
    expect(FilterServiceMocks.findAdventuresByFilter({})).toEqual({
        code: 200,
        message: "Adventures found",
        payload: [
            MockTestData.testAdventure1,
            MockTestData.testAdventure2
        ]
    });
});

// RequestStoreMocks tests
test('sendRequest', () => {
    expect(RequestStoreMocks.sendRequest({})).toEqual({
        code: 200,
        message: "Request sent successfully",
        payload: MockTestData.testRequest1
    });
});

test('getRequests', () => {
    expect(RequestStoreMocks.getRequests("")).toEqual({
        code: 200,
        message: "Requests found",
        payload: [
            MockTestData.testRequest1,
            MockTestData.testRequest2
        ]
    });
});

test('acceptRequest', () => {
    var acceptedRequest = MockTestData.testRequest1;
    acceptedRequest.status = "ACCEPTED";
    expect(RequestStoreMocks.acceptRequest("")).toEqual({
        code: 200,
        message: "Request accepted successfully",
        payload: acceptedRequest
    });
});

test('rejectRequest', () => {
    var rejectedRequest = MockTestData.testRequest1;
    rejectedRequest.status = "REJECTED";
    expect(RequestStoreMocks.rejectRequest("")).toEqual({
        code: 200,
        message: "Request rejected successfully",
        payload: rejectedRequest
    });
});

test('checkIfRequestExists', () => {
    expect(RequestStoreMocks.checkIfRequestExists("")).toEqual({
        code: 200,
        message: "Request found",
        payload: MockTestData.testRequest1
    });
});

test('getUserProfile', () => {
    expect(UserStoreMocks.getUserProfile("")).toEqual({
        code: 200,
        message: "User Profile found",
        payload: MockTestData.testProfile
    });
});