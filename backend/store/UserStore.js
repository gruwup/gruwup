const Profile = require("../models/Profile");

module.exports = class User {
    static getUserProfile = async (userId) => {
        try {
            var result = await Profile.findOne({ userId: userId });
    
            if (result) {
                return {
                    code: 200,
                    message: "User Profile found",
                    payload: result
                }
            }
            else {
                return {
                    code: 404,
                    message: "User Profile not found"
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
    
    static createUser = async (profile) => {
        var user = new Profile(profile);
            
        try {
            var result = await user.save();
    
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
    
    static updateUser = async (userId, profile) => {
        try {
            var result = await Profile.findOneAndUpdate(
                { userId: userId },
                { $set: profile },
                {new: true});
    
            if (result) {
                return {
                    code: 200,
                    message: "User Profile updated successfully",
                    payload: result
                }
            }
            else {
                return {
                    code: 404,
                    message: "User Profile not found"
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
