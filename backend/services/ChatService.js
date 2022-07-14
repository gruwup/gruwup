const AdventureStore = require("../store/AdventureStore");
const ChatStore = require("../store/ChatStore");
const ChatSocket = require("./ChatSocket");

var messageCount = {}

module.exports = class ChatService {
    static sendMessage = async (adventureId, message) => {
        var adventure = await AdventureStore.getAdventureDetail(adventureId);
        if (adventure.code !== 200) {
            return {
                code: adventure.code,
                message: adventure.message
            }
        }
        var participants = adventure['payload']['peopleGoing'];
        var result;

        if (participants.includes(message.userId)) {
            if (!messageCount[adventureId] || messageCount[adventureId] == 10) messageCount[adventureId] = 0;
            messageCount[adventureId]++;
            ChatSocket.sendMessage(message.userId, adventureId, message);

            if (messageCount[adventureId] == 1) {
                result = await ChatStore.storeNewMessageGroup(adventureId, message, message.dateTime);
            } else {
                result = await ChatStore.storeExistingMessageGroup(adventureId, message, message.dateTime);
            }
                
            if (result.code === 200) {
                return {
                    code: result.code,
                    message: "Successfully sent message",
                    payload: result.payload
                }
            }
            else {
                return {
                    code: result.code,
                    message: result.message
                }
            }
        }
        else {
            return {
                code: 400,
                message: "User is not participant of adventure"
            }
        }
    }

    static getRecentMessages = async (userId) => {
        var adventureList = await AdventureStore.getUsersAdventures(userId);
        if (adventureList.code === 200) {
            var messages = [];
            var message;
            var adventure;
            var timestamp = Date.now();
            var emptyMessage = {
                userId: "",
                name: "",
                message: "",
                dateTime: ""
            }
            var adventureIds = adventureList.payload.map(adventure => adventure.toString());
            for (var i = 0; i < adventureIds.length; i++) {
                message = await ChatStore.getMostRecentMessage(adventureIds[i], timestamp);
                adventure = await AdventureStore.getAdventureDetail(adventureIds[i]);
                if (message.code === 200) {
                    messages.push({ adventureId: adventureIds[i], adventureTitle: adventure.payload.title, ...message.payload });
                } else {
                    messages.push({ adventureId: adventureIds[i], adventureTitle: adventure.payload.title, ...emptyMessage });
                }
            }
            return {
                code: 200,
                messages: "Successfully obtained recent messages",
                payload: messages
            }
        }
        else {
            return {
                code: adventureList.code,
                messages: adventureList.message
            }
        }
    };
}


