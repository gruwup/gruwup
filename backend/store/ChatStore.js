const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        var paginationResult = await this.getPrevPagination(adventureId, dateTime);
        var messageGroup = { 
            adventureId, 
            pagination: dateTime, 
            prevPagination: paginationResult.payload ? paginationResult.payload : null,
            messages: [messages]
        }
        messageGroup = new Message(messageGroup);
        await messageGroup.save().then(messageResult => {
            return result = {
                code: 200,
                message: "Group created successfully",
                payload: messageResult
            };
        }, err => {
            if (err.name === "ValidationError") {
                return result = {
                    code: 400,
                    message: err._message
                };
            }
            return result = {
                code: 500,
                message: err._message
            }
        });
    };

    static storeExistingMessageGroup = async (adventureId, message, dateTime) => {
        await this.getPrevPagination(adventureId, dateTime).then(async paginationResult => {
            if (!paginationResult) {
                return result = {
                    code: 404,
                    message: "Pagination not found"
                };
            }
            var paginationObj = { pagination: dateTime };
            var messagesObj = { messages: message };
            await Message.findOneAndUpdate( // update pagination and add message to object array
                            { adventureId, pagination: paginationResult.payload },
                            { $set: paginationObj,  $push: messagesObj },
                            { new: true, runValidators: true }
            ).then(messageResult => {
                if (!messageResult) {
                    return result = {
                        code: 404,
                        message: "Group not found"
                    };
                }
                return result = {
                    code: 200,
                    message: "Group created successfully",
                    payload: messageResult
                };
            }, err => {
                if (err.name === "ValidationError") {
                    return result = {
                        code: 400,
                        message: err._message
                    };
                }
                return result = {
                    code: 500,
                    message: err._message
                }
            });
        }, err => {
            return result = {
                code: 500,
                message: err._message
            }
        });
    };

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        await Message.find({ adventureId }).then(messageResult => {
            if (!messageResult) {
                return result = {
                    code: 404,
                    message: "No previous messages found",
                }
            }
            var prevPagination = null;
            if (messageResult.length) {
                prevPagination = messageResult.map(chat => chat.pagination).reduce((prev, curr) => {
                    if (prev > pagination && curr > pagination) return null;
                    else if (prev > pagination) return curr;
                    else if (curr > pagination) return prev;
                    else return (Math.abs(curr - pagination) < Math.abs(prev - pagination) ? curr : prev);
                });
                return result = {
                    code: 200,
                    message: "Previous pagination found",
                    payload: prevPagination
                };
            }
        }, err => {
            return result = {
                code: 500,
                message: err
            }
        })
    };

    static getMessages = async (adventureId, pagination) => {
        await Message.findOne({ adventureId, pagination }).then(messageResult => {
            if (!messageResult) {
                return result = {
                    code: 404,
                    message: "Messages not found"
                }
            }
            return result = {
                code: 200,
                message: "Messages found",
                payload: messageResult
            }
        }, err => {
            return result = {
                code: 500,
                message: err
            }
        });
    };

    static getMostRecentMessage = async (adventureId, dateTime) => {
        await this.getPrevPagination(adventureId, dateTime).then(async paginationResult => {
            if (paginationResult) {
                await Message.findOne({ adventureId, pagination: paginationResult.payload }).then(messageResult => {
                    if (messageResult) {
                        var message = messageResult.messages[messageResult.messages.length - 1];
                        return result = {
                            code: 200,
                            message: "Messages found",
                            payload: message
                        }
                    }
                    return result = {
                        code: 404,
                        message: "Messages not found"
                    }
                }, err => {
                    return result = {
                        code: 500,
                        message: err
                    };
                }) 
            }
            return result = {
                code: 404,
                message: "Messages not found"
            }
        }, err => {
            return result = {
                code: 500,
                message: err
            };
        });
    };

    static deleteChat = async (adventureId) => {
        await Message.deleteMany({ adventureId }).then(messageResult => {
            if (!messageResult.deletedCount) {
                return result = {
                    code: 404,
                    message: "Adventure not found"
                }
            }
            return result = {
                code: 200,
                message: "Adventure chat deleted"
            }
        }, err => {
            return result = {
                code: 500,
                message: err
            };
        });
    };
};
