const RequestStore = require("../store/RequestStore");
const mongoose = require("mongoose");
const customMongoPort = "27384";
var mongoDbUrl = "mongodb://localhost:" + customMongoPort;

var request = {
    adventureId: "1123123",
    adventureOwner: "minerva",
    adventureTitle: "Transfiguration Show",
    requester: "severus",
    requesterId: "severus",
    status: "PENDING",
    dateTime: "1887602251"
}

var request2 = {
    adventureId: {},
    adventureOwner: "minerva",
    adventureTitle: "Transfiguration Show",
    requester: "severus",
    requesterId: "severus",
    status: "PENDING",
    dateTime: "1887602251"
}

var request3 = {
    adventureId: 1,
    adventureOwner: "minerva",
    adventureTitle: "Transfiguration Show",
    requester: "severus",
    requesterId: "severus",
    status: "HELLO",
    dateTime: "1887602251"
}

var test1 = async () => {
    var result = await RequestStore.sendRequest(request);
    console.log(result);
    var result2 = await RequestStore.sendRequest(request2)
    console.log(result2);
    var result3 = await RequestStore.sendRequest(request3)
    console.log(result3);
}

var test2 = async () => {
    requesterId = "severus";
    creatorId = "minerva"
    var result = await RequestStore.getRequests(requesterId);
    console.log(result);
    var result2 = await RequestStore.getRequests(creatorId);
    console.log(result2);
    var result3 = await RequestStore.getRequests("1111");
    console.log(result3);
}

var test3 = async () => {
    var result = await RequestStore.acceptRequest("62c4ed8350d9d9058b4faee2");
    console.log(result);
    var result2 = await RequestStore.acceptRequest("62ce59c63641e9fbd2a9a944");
    console.log(result2);
    var result3 = await RequestStore.acceptRequest("1111");
    console.log(result3);
}

var test4 = async () => {
    var result = await RequestStore.rejectRequest("62c4ed8350d9d9058b4faee2");
    console.log(result);
    var result2 = await RequestStore.rejectRequest("62ce59c63641e9fbd2a9a944");
    console.log(result2);
    var result3 = await RequestStore.rejectRequest("1111");
    console.log(result3);
}

var test5 = async () => {
    var result = await RequestStore.checkIfRequestExists("62c4ed7950d9d9058b4faede", "11131");
    console.log(result);
    var result2 = await RequestStore.checkIfRequestExists("1", "62ce59c63641e9fbd2a9a944");
    console.log(result2);
    var result3 = await RequestStore.checkIfRequestExists("62c4e441d1bddace152a064f", "69");
    console.log(result3);
    var result3 = await RequestStore.checkIfRequestExists("420", "69");
    console.log(result3);
}

mongoose
.connect(mongoDbUrl, { useNewUrlParser: true })
.then(() => {
    console.log("connected to mongoDB")
    // test1()
    // test2()
    // test3()
    // test4()
    // test5()
})






