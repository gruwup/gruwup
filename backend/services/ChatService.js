const AdventureStore = require("../store/AdventureStore");
const ChatStore = require("../store/ChatStore");
const ChatSocket = require("./ChatSocket");

var messageCount = {}

module.exports = class ChatService {
    static sendMessage = async (adventureId, message) => {
        var result;

        await AdventureStore.getAdventureDetail(adventureId).then(async adventure => {
            result = {
                code: adventure.code,
                message: adventure.message
            }
            if (result.code === 200) {
                var participants = adventure['payload']['peopleGoing'];
                result = {
                    code: 400,
                    message: "User is not participant of adventure"
                }
                if (participants.includes(message.userId)) {
                    if (!messageCount[adventureId] || messageCount[adventureId] === 10) messageCount[adventureId] = 0;
                    messageCount[adventureId]++;
                    ChatSocket.sendMessage(message.userId, adventureId, message);
    
                    if (messageCount[adventureId] === 1) {
                        await ChatStore.storeNewMessageGroup(adventureId, message, message.dateTime).then(messageResult => {
                            result.code = messageResult.code
                            result.message = (messageResult.code === 200) ? "Successfully sent message" : messageResult.message;
                            result.payload = (messageResult.code === 200) ? messageResult.payload : null;
                        }, err => {
                            result = {
                                code: 500,
                                message: err
                            };
                        });
                    } else {
                        await ChatStore.storeExistingMessageGroup(adventureId, message, message.dateTime).then(messageResult => {
                            result.code = messageResult.code
                            result.message = (messageResult.code === 200) ? "Successfully sent message" : messageResult.message;
                            result.payload = (messageResult.code === 200) ? messageResult.payload : null;
                        }, err => {
                            result = {
                                code: 500,
                                message: err
                            };
                        });
                    }
                }
            }
        }, err => {
            result = {
                code: 500,
                message: err
            };
        });

        return result;
    }

    static getRecentMessages = async (userId) => {
        var result;

        await AdventureStore.getUsersAdventures(userId).then(async adventureList => {
            result = {
                code: adventureList.code,
                messages: adventureList.message
            }
            if (adventureList.code === 200) {
                var messages = [];
                var message;
                var adventure;
                var timestamp = Date.now();
                var adventureIds = adventureList.payload.map(adventure => adventure._id);
                for (var i = 0; i < adventureIds.length; i++) {
                    await ChatStore.getMostRecentMessage(adventureIds[i], timestamp).then(messageResult => {
                        message = messageResult;
                    }, err => {
                        result = {
                            code: 500,
                            message: err
                        };
                    });
                    await AdventureStore.getAdventureDetail(adventureIds[i]).then(adventureResult => {
                        adventure = adventureResult;
                    }, err => {
                        result = {
                            code: 500,
                            message: err
                        };
                    });

                    if (message.code === 200) {
                        messages.push({ 
                            adventureId: adventureIds[i], 
                            adventureTitle: adventure.payload.title,
                            userId: message.payload.userId,
                            name: message.payload.name,
                            message: message.payload.message,
                            dateTime: message.payload.dateTime
                        });
                    } else if (adventure.code === 200) {
                        messages.push({ 
                            adventureId: adventureIds[i], 
                            adventureTitle: adventure.payload.title, 
                            userId: "",
                            name: "",
                            message: "",
                            dateTime: "" 
                        });
                    }
                }
                messages.sort((messageA, messageB) => {
                    return messageB.dateTime - messageA.dateTime;
                });
    
                result = {
                    code: 200,
                    messages: "Successfully obtained recent messages",
                    payload: messages
                }
            }
        }, err => {
            result = {
                code: 500,
                message: err
            };
        });

        return result
    };
}


