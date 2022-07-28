const mongoose = require("mongoose");

const app = require("./app");
const PORT = 8081;
const PORT_SOCKET = 8000;
const defaultMongoPort = "27017";
const customMongoPort = "27384";

// Grant is using the custom mongo port 27384, leave this boolean to true if you want to use the default mongo port 27017
var useDefaultMongoPort = false;
var mongoDbUrl = "mongodb://localhost:" + (useDefaultMongoPort ? defaultMongoPort : customMongoPort);

// Chat server
const ChatSocket = require("./services/ChatSocket");

async function run() {
    try {
        mongoose
            .connect(mongoDbUrl, { useNewUrlParser: true })
            .then(() => {
                console.log("Connected to MongoDB");
                var server = app.listen(PORT, (req, res) => {
                    var host = server.address().address;
                    var port = server.address().port;
                    console.log("App listening at http://%s:%s", host, port);
                })
                var socketServer = app.listen(PORT_SOCKET, (req, res) => {
                    var host = socketServer.address().address;
                    var port = socketServer.address().port;
                    console.log("Chat listening at http://%s:%s", host, port);
                    ChatSocket.runChat(socketServer);
                }) 
            });

        setInterval(() => {
            const currentTime = new Date().getTime();
            const currentUnixTime = Math.floor(currentTime / 1000);
            mongoose.connection.db.collection("adventures").deleteMany({
                "dateTime": { $lt: currentUnixTime }
            });
            mongoose.connection.db.collection("requests").deleteMany({
                "adventureExpireAt": { $lt: currentUnixTime }
            });

        }, 1000*60);
    }
    catch (err) {
        console.log(err.stack);
        await client.close();
    }
}

run();