const { Server } = require("socket.io");

const runChat = (server, port) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
    });
    
}

module.exports = { runChat };