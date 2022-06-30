const Message = require("../models/Message");

module.exports = class User {
    static storeMessages = async (adventureId, messages, dateTime) => {
        try {
            var paginationResult = await this.getClosestPagination(adventureId, dateTime);
            var result = await Message.save({ adventureId: adventureId, messages: messages, dateTime: dateTime, prevDateTime:  paginationResult.payload });
            
            return {
                code: 200,
                message: "Profile created successfully",
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

    static getPrevDateTime = async (adventureId, dateTime) => {
        try {
            var result = await Message.find({ adventureId: adventureId });
            var closestDateTime = null;
            if (result) {
                closestDateTime = result.forEach(message => message.dateTime).reduce((prev, curr) => {
                    if (prev > dateTime && curr > dateTime) return null;
                    else if (prev > goal) return curr;
                    else if (curr > goal) return prev;
                    else return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                });

                return {
                    code: 200,
                    message: "Prev dateTime found",
                    payload: closestDateTime
                };
            }
            
            return {
                code: 404,
                message: "No previous dateTime found",
                payload: closestDateTime
            };
        }
        catch (err) {
            return err;
        }
    };

    static getMessages = async (adventureId, dateTime) => {
        try {
            var result = await Message.findOne({ adventureId: adventureId, dateTime: dateTime });
            
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
};
