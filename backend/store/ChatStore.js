const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        try {
            var paginationResult = await this.getPrevPagination(adventureId, dateTime);
            var messageGroup = { 
                adventureId, 
                pagination: dateTime, 
                prevPagination: paginationResult.payload ? paginationResult.payload : null,
                messages: [messages]
            }
            messageGroup = new Message(messageGroup);
            var result = await messageGroup.save();

            return {
                code: 200,
                message: "Group created successfully",
                payload: result
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static storeExistingMessageGroup = async (adventureId, message, dateTime) => {
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var result = await Message.findOneAndUpdate( // update pagination and add message to object array
                                { adventureId, pagination: paginationResult.payload },
                                { $set: { pagination: dateTime },  $push: { messages: message } },
                                { new: true }
                            );
        return {
            code: 200,
            message: "Group updated successfully",
            payload: result
        };
    };

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        var result = await Message.find({ adventureId });
        var prevPagination = null;
        if (result.length) {
            prevPagination = result.map(chat => chat.pagination).reduce((prev, curr) => {
                if (prev > pagination && curr > pagination) return null;
                else if (prev > pagination) return curr;
                else if (curr > pagination) return prev;
                else return (Math.abs(curr - pagination) < Math.abs(prev - pagination) ? curr : prev);
            });
            return {
                code: 200,
                message: "Previous pagination found",
                payload: prevPagination
            };
        }
        
        return {
            code: 404,
            message: "No previous pagination found",
            payload: prevPagination
        };
    };

    static getMessages = async (adventureId, pagination) => {
        var result = await Message.findOne({ adventureId, pagination });
        
        if (result) {
            return {
                code: 200,
                message: "Messages found",
                payload: result
            }
        }
        else {
            return {
                code: 404,
                message: "Messages not found"
            }
        }
    };

    static getMostRecentMessage = async (adventureId, dateTime) => {
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var result = await Message.findOne({ adventureId, pagination: paginationResult.payload });
        if (result) {
            var message = result.messages[result.messages.length - 1];
            if (result) {
                return {
                    code: 200,
                    message: "Messages found",
                    payload: message
                }
            }
        }
        
        else {
            return {
                code: 404,
                message: "Messages not found"
            }
        }
    };

    static deleteChat = async (adventureId) => {
        var result = await Message.deleteMany({ adventureId });
        if (result) {
            return {
                code: 200,
                message: "Adventure chat deleted"
            }
        }
        else {
            return {
                code: 404,
                message: "Adventure not found"
            }
        }
    };
};
