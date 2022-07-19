const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        var result;
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var messageGroup = { 
            adventureId, 
            pagination: dateTime, 
            prevPagination: paginationResult.payload ? paginationResult.payload : null,
            messages: [messages]
        }
        messageGroup = new Message(messageGroup);

        try {
            var messageResult = await messageGroup.save();
            result = {
                code: 200,
                message: "Group created successfully",
                payload: messageResult
            };
        } catch (err) {
            result = {
                code: 400,
                message: err._message
            };
        }
        
        return result;
    };

    static storeExistingMessageGroup = async (adventureId, message, dateTime) => {
        var result;
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var paginationObj = { pagination: dateTime };
        var messagesObj = { messages: message };

        try {
            var messageResult = await Message.findOneAndUpdate( // update pagination and add message to object array
                            { adventureId, pagination: paginationResult.payload },
                            { $set: paginationObj,  $push: messagesObj },
                            { new: true }
                        );
            if (messageResult) {
                result = {
                    code: 200,
                    message: "Group updated successfully",
                    payload: messageResult
                }
            }
            else {
                result = {
                    code: 404,
                    message: "Group not found"
                };
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        
        return result;
    };

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        var result;

        try {
            var messageResult = await Message.find({ adventureId });
            if (messageResult) {
                var prevPagination = null;
                if (messageResult.length) {
                    prevPagination = messageResult.map(chat => chat.pagination).reduce((prev, curr) => {
                        if (prev > pagination && curr > pagination) return null;
                        else if (prev > pagination) return curr;
                        else if (curr > pagination) return prev;
                        else return (Math.abs(curr - pagination) < Math.abs(prev - pagination) ? curr : prev);
                    });
                    result = {
                        code: 200,
                        message: "Previous pagination found",
                        payload: prevPagination
                    };
                }
            }
            else {
                result = {
                    code: 404,
                    message: "No previous messages found",
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }

        return result;
    };

    static getMessages = async (adventureId, pagination) => {
        var result;

        try {
            var messageResult = await Message.findOne({ adventureId, pagination });
            if (messageResult) {
                result = {
                    code: 200,
                    message: "Messages found",
                    payload: messageResult
                }
            }
            else {
                result = {
                    code: 404,
                    message: "Messages not found"
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            }
        }
        
        return result;
    };

    static getMostRecentMessage = async (adventureId, dateTime) => {
        var result;

        try {
            var paginationResult = await this.getPrevPagination(adventureId, dateTime);
            var messageResult = await Message.findOne({ adventureId, pagination: paginationResult.payload });
            if (messageResult) {
                var message = messageResult.messages[messageResult.messages.length - 1];
                if (messageResult) {
                    result = {
                        code: 200,
                        message: "Messages found",
                        payload: message
                    }
                }
            }
            else {
                result = {
                    code: 404,
                    message: "Messages not found"
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }
        
        return result;
    };

    static deleteChat = async (adventureId) => {
        var result;

        try {
            var messageResult = await Message.deleteMany({ adventureId });
            if (messageResult) {
                result = {
                    code: 200,
                    message: "Adventure chat deleted"
                }
            }
            else {
                result = {
                    code: 404,
                    message: "Adventure not found"
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }
        
        
        return result;
    };
};
