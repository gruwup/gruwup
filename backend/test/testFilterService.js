const FilterService = require("../services/FilterService");
const mongoose = require("mongoose");
const customMongoPort = "27384";
var mongoDbUrl = "mongodb://localhost:" + customMongoPort;

var test1 = async () => {
    // var result = await FilterService.getNearbyAdventures
    var result = await FilterService.getNearbyAdventures({});
    console.log(result);
}

mongoose
.connect(mongoDbUrl, { useNewUrlParser: true })
.then(() => {
    console.log("connected to mongoDB")
    test1()
    // test2()
    // test3()
})






