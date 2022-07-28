

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

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

module.exports = app;