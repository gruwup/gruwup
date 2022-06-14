const express = require("express");
const app = express();
const PORT = 8081;

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

// applying routes
app.use("/account", accountRoute);
app.use("/user/profile", profileRoute);
app.use("/user/adventure", adventureRoute);
app.use("/user/chat", chatRoute);
app.use("/user/request", requestRoute);


async function run() {
    try {
        var server = app.listen(PORT, (req, res) => {
            var host = server.address().address;
            var port = server.address().port;
            console.log("App listening at http://%s:%s", host, port);
        })
    }
    catch (err) {
        console.log(err.stack);
        await client.close();
    }
}

run()