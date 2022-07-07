const io = require("socket.io-client");
const socket = io("http://localhost:8000");
var cookie = "gruwup-session=123";
var userId = "116853060753534924974";

const run = () => {
    socket.emit("userInfo", cookie, userId);

    socket.on('connected', (result) => {
        console.log("connected to socket")
        if (result) {
            socket.on('message', (adventureId, message) => {
                console.log(adventureId);
                console.log(message);
            })
        }
    })

    socket.on('exception', (error) => {
        console.log(error);
    });
}
run();
