const io = require("socket.io-client");
// const socket = io("http://20.227.142.169:8000");
const socket = io("http://192.168.1.30:8000/");
// const socket = io("http://10.0.2.2:8000");


var cookie = "gruwup-session=123";
var userId = "1111111";

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
        // if (result) {
        //     socket.on('message', ( message) => {
        //         console.log(adventureId);
        //         console.log(message);
        //     })
        // }
    })

    socket.on('exception', (error) => {
        console.log(error);
    });
}
run();
