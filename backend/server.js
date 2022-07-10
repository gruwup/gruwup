const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8081;
const PORT_SOCKET = 8000;
const defaultMongoPort = "27017";
const customMongoPort = "27384";

// Grant is using the custom mongo port 27384, leave this boolean to true if you want to use the default mongo port 27017
var useDefaultMongoPort = true;
var mongoDbUrl = "mongodb://localhost:" + (useDefaultMongoPort ? defaultMongoPort : customMongoPort);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

// routes import
const accountRoute = require("./routes/Account");
const profileRoute = require("./routes/Profile");
const adventureRoute = require("./routes/Adventure");
const chatRoute = require("./routes/Chat");
const requestRoute = require("./routes/Request");

// Chat server
const ChatSocket = require("./services/ChatSocket");

// applying routes
app.use("/account", accountRoute);
app.use("/user/profile", profileRoute);
app.use("/user/adventure", adventureRoute);
app.use("/user/chat", chatRoute);
app.use("/user/request", requestRoute);


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
            })
    }
    catch (err) {
        console.log(err.stack);
        await client.close();
    }
}

run()