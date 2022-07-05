const { Server } = require("socket.io");
const AdventureStore = require("../store/AdventureStore");
const Session = require("../services/Session");
var io;

module.exports = class ChatSocket {

    // Listens for connections to chat server
    static runChat = async (server) => {
        io = new Server(server);
        io.on('connection', (socket) => {
            socket.on('userInfo', (cookie, userId) => {
                if (Session.validSession(cookie)) {
                    socket.username = userId;
                    socket.emit('connected', true);
                }
                else {
                    socket.emit('connected', false);
                    socket.disconnect();
                }
            });
        });
    };

    // sends messages to all users participating in an adventure (except sender)
    static sendMessage = async (userId, adventureId, message) => {
        try {
            var sockets = io.sockets.sockets;

            sockets.forEach(async (socket, key) => {
                if (userId !== socket.username) {
                    var adventure = await AdventureStore.getAdventureDetail(adventureId);
                    var participants = adventure['payload']['peopleGoing'];
                    if (participants.includes(socket.username)) {
                        socket.emit('message', adventureId, message);
                    }
                }
            })
            return {
                code: 200,
                message: "Message successfully send to participants"
            }
        }
        catch (err) {
            return {
                code: 400,
                message: "Error occurred sending message to participants"
            }
        }
    }
};