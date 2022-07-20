const AdventureStore = require("../store/AdventureStore");
const ChatStore = require("../store/ChatStore");
const ChatSocket = require("./ChatSocket");

var messageCount = {}

module.exports = class ChatService {
    static sendMessage = async (adventureId, message) => {
        var result;

        await AdventureStore.getAdventureDetail(adventureId).then(async adventure => {
            if (adventure.code !== 200) {
                result = {
                    code: adventure.code,
                    message: adventure.message
                }
            }
            else {
                var participants = adventure['payload']['peopleGoing'];
                var messageResult;
    
                if (participants.includes(message.userId)) {
                    if (!messageCount[adventureId] || messageCount[adventureId] === 10) messageCount[adventureId] = 0;
                    messageCount[adventureId]++;
                    ChatSocket.sendMessage(message.userId, adventureId, message);
    
                    if (messageCount[adventureId] === 1) {
                        await ChatStore.storeNewMessageGroup(adventureId, message, message.dateTime).then(messageResult => {
                            if (messageResult.code === 200) {
                                result = {
                                    code: messageResult.code,
                                    message: "Successfully sent message",
                                    payload: messageResult.payload
                                }
                            }
                            else {
                                result = {
                                    code: messageResult.code,
                                    message: messageResult.message
                                }
                            }
                        }, err => {
                            result = {
                                code: 500,
                                message: err
                            };
                        });
                    } else {
                        messageResult = await ChatStore.storeExistingMessageGroup(adventureId, message, message.dateTime).then(messageResult => {
                            if (messageResult.code === 200) {
                                result = {
                                    code: messageResult.code,
                                    message: "Successfully sent message",
                                    payload: messageResult.payload
                                }
                            }
                            else {
                                result = {
                                    code: messageResult.code,
                                    message: messageResult.message
                                }
                            }
                        }, err => {
                            result = {
                                code: 500,
                                message: err
                            };
                        });
                    }
                }
                else {
                    result = {
                        code: 400,
                        message: "User is not participant of adventure"
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
            if (adventureList.code === 200) {
                var messages = [];
                var message;
                var adventure;
                var timestamp = Date.now();
                var adventureIds = adventureList.payload.map(adventure => adventure.toString());
                for (var i = 0; i < adventureIds.length; i++) {
                    message = await ChatStore.getMostRecentMessage(adventureIds[i], timestamp);
                    adventure = await AdventureStore.getAdventureDetail(adventureIds[i]);
                    if (message.code === 200 && message.code === 200) {
                        messages.push({ 
                            adventureId: adventureIds[i], 
                            adventureTitle: adventure.payload.title,
                            userId: message.payload.userId,
                            name: message.payload.name,
                            message: message.payload.message,
                            dateTime: message.payload.dateTime
                        });
                    } else {
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
            else {
                result = {
                    code: adventureList.code,
                    messages: adventureList.message
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


