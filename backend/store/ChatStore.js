const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        var result = {
            code: 500,
            message: "Server error"
        }
        
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        if (paginationResult.code !== 200) {
            result = paginationResult;
        }
        else {
            var messageGroup = { 
                adventureId, 
                pagination: dateTime, 
                prevPagination: paginationResult.payload ? paginationResult.payload : null,
                messages: [messages]
            }
            messageGroup = new Message(messageGroup);
            var messageResult = await messageGroup.save();
            if (messageResult) {
                result = {
                    code: 200,
                    message: "Group created successfully",
                    payload: messageResult
                };
                
            }
            else {
                result = {
                    code: 400,
                    message: "Group creation unsuccessful"
                };
            }
        }
        
        return result;
    };

    static storeExistingMessageGroup = async (adventureId, message, dateTime) => {
        var result = {
            code: 500,
            message: "Server error"
        }

        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        if (paginationResult.code !== 200) {
            result = paginationResult;
        }
        else {
            var pagination = { pagination: dateTime };
            var message = { message };
            var messageResult = await Message.findOneAndUpdate( // update pagination and add message to object array
                                { adventureId, pagination: paginationResult.payload },
                                { $set: pagination,  $push: message },
                                { new: true }
                            );
            if (messageResult.code !== 200) {
                result = {
                    code: messageResult.code,
                    message: messageResult.message
                }
            }
            else {
                result = {
                    code: 200,
                    message: "Group updated successfully",
                    payload: messageResult
                };
            }
        }
        
        return result;
    };

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        var result = {
            code: 500,
            message: "Server error"
        }

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

        return result;
    };

    static getMessages = async (adventureId, pagination) => {
        var result = {
            code: 500,
            message: "Server error"
        }

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
        return result;
    };

    static getMostRecentMessage = async (adventureId, dateTime) => {
        var result = {
            code: 500,
            message: "Server error"
        }

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
        
        return result;
    };

    static deleteChat = async (adventureId) => {
        var result = {
            code: 500,
            message: "Server error"
        }

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
        
        return result;
    };
};
