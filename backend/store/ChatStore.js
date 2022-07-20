const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        var result = {};
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var messageGroup = { 
            adventureId, 
            pagination: dateTime, 
            prevPagination: paginationResult.payload ? paginationResult.payload : null,
            messages: [messages]
        }
        messageGroup = new Message(messageGroup);
        await messageGroup.save().then(messageResult => {
            result = {
                code: 200,
                message: "Group created successfully",
                payload: messageResult
            };
        }, err => {
            result.code = (err.name === "ValidationError") ? 400 : 500
            result.message = err._message;
        });
        
        return result;
    };

    static storeExistingMessageGroup = async (adventureId, message, dateTime) => {
        var result = {};

        await this.getPrevPagination(adventureId, dateTime).then(async paginationResult => {
            result = {
                code: 404,
                message: "Pagination not found"
            };
            if (paginationResult) {
                var paginationObj = { pagination: dateTime };
                var messagesObj = { messages: message };
                await Message.findOneAndUpdate( // update pagination and add message to object array
                                { adventureId, pagination: paginationResult.payload },
                                { $set: paginationObj,  $push: messagesObj },
                                { new: true, runValidators: true }
                ).then(messageResult => {
                    if (!messageResult) {
                        result = {
                            code: 404,
                            message: "Group not found"
                        };
                    }
                    else {
                        result = {
                            code: 200,
                            message: "Group created successfully",
                            payload: messageResult
                        };
                    }
                }, err => {
                    result.code = (err.name === "ValidationError") ? 400 : 500
                    result.message = err._message;
                });
            }
        }, err => {
            result = {
                code: 500,
                message: err._message
            }
        });
        
        return result;
    };

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        var result;

        await Message.find({ adventureId }).then(messageResult => {
            result = {
                code: 404,
                message: "No previous messages found",
            }
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
        }, err => {
            result = {
                code: 500,
                message: err
            }
        })

        return result;
    };

    static getMessages = async (adventureId, pagination) => {
        var result;

        await Message.findOne({ adventureId, pagination }).then(messageResult => {
            result = {
                code: 200,
                message: "Messages found",
                payload: messageResult
            }
            if (!messageResult) {
                result = {
                    code: 404,
                    message: "Messages not found"
                }
            }
        }, err => {
            result = {
                code: 500,
                message: err
            }
        });
        
        return result;
    };

    static getMostRecentMessage = async (adventureId, dateTime) => {
        var result;
        await this.getPrevPagination(adventureId, dateTime).then(async paginationResult => {
            result = {
                code: 404,
                message: "Messages not found"
            }
            if (paginationResult) {
                await Message.findOne({ adventureId, pagination: paginationResult.payload }).then(messageResult => {
                    result = {
                        code: 404,
                        message: "Messages not found"
                    }
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
                }, err => {
                    result = {
                        code: 500,
                        message: err
                    };
                }) 
            }
        }, err => {
            result = {
                code: 500,
                message: err
            };
        });
        
        return result;
    };

    static deleteChat = async (adventureId) => {
        var result;

        await Message.deleteMany({ adventureId }).then(messageResult => {
            result = {
                code: 200,
                message: "Adventure chat deleted"
            }
            if (!messageResult.deletedCount) {
                result = {
                    code: 404,
                    message: "Adventure not found"
                }
            }
        }, err => {
            result = {
                code: 500,
                message: err
            };
        });
        
        return result;
    };
};