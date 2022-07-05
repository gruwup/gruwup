const Message = require("../models/Message");

module.exports = class User {
    static storeNewMessageGroup = async (adventureId, messages, dateTime) => {
        try {
            var paginationResult = await this.getPrevPagination(adventureId, dateTime);
            var message = { 
                adventureId: adventureId, 
                pagination: dateTime, 
                prevPagination: paginationResult.payload ? paginationResult.payload : null,
                messages: [messages]
            }
            var message = new Message(message);
            var result = await message.save();

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
        try {
            var paginationResult = await this.getPrevPagination(adventureId, dateTime);
            var result = await Message.findOneAndUpdate( // update pagination and add message to object array
                                    { adventureId: adventureId, pagination: paginationResult.payload },
                                    { $set: { pagination: dateTime },  $push: { messages: message } },
                                    { new: true }
                                );
            return {
                code: 200,
                message: "Group updated successfully",
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

    // get most recent message time before dateTime
    static getPrevPagination = async (adventureId, pagination) => {
        try {
            var result = await Message.find({ adventureId: adventureId });
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
        }
        catch (err) {
            return err;
        }
    };

    static getMessages = async (adventureId, pagination) => {
        try {
            var result = await Message.findOne({ adventureId: adventureId, pagination: pagination });
            
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
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };

    static deleteChat = async (adventureId) => {
        try {
            var result = await Message.deleteMany({ adventureId: adventureId });
            
            if (result) {
                return {
                    code: 200,
                    message: "Adventure chat deleted",
                    payload: result
                }
            }
            else {
                return {
                    code: 404,
                    message: "Adventure not found"
                }
            }
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };
};
