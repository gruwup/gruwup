const Adventure = require("../models/Adventure");
const Profile = require("../models/Profile");

module.exports = class User {
    static getUserProfile = async (userId) => {
        var result;

        await Profile.findOne({ userId }).then(async profileResult => {
            result = {
                code: 404,
                message: "User Profile not found"
            }
            if (profileResult) {
                await Adventure.find({ owner: userId }).then(adventuresResult => {
                    var adventures = [];
                    adventuresResult.forEach(adventure => adventures.push(adventure));
                    var profile = { 
                        userId: profileResult.userId,
                        name: profileResult.name,
                        biography: profileResult.biography,
                        categories: profileResult.categories,
                        image: profileResult.image,
                        adventuresCreated: adventures 
                    };
                    
                    result = {
                        code: 200,
                        message: "User Profile found",
                        payload: profile
                    }
                }, err => {
                    result = {
                        code: 500,
                        message: err._message
                    };
                });
            }
        }, err => {
            result = {
                code: 500,
                message: err._message
            };
        });

        return result;
    };
    
    static createUser = async (profile) => {
        var result = {};

        await Profile.findOne({ userId: profile.userId }).then(async found => {
            result = {
                code: 400,
                message: "Profile exists for userId",
                payload: result
            };
            if (!found) {
                var user = new Profile(profile);
                await user.save().then(profileResult => {
                    result = {
                        code: 200,
                        message: "Profile created successfully",
                        payload: profileResult
                    };
                }, err => {
                    result.code = (err.name === "ValidationError") ? 400 : 500;
                    result.message = err._message;
                });
            }
        }, err => {
            result = {
                code: 400,
                message: err
            };
        });

        return result;
    };
    
    static updateUser = async (userId, profile) => {
        var result;
        
        await Profile.findOneAndUpdate({ userId }, { $set: profile }, {new: true, runValidators: true }).then(profileResult => {
            result = {
                code: 404,
                message: "User Profile not found"
            }
            if (profileResult) {
                result = {
                    code: 200,
                    message: "User Profile updated successfully",
                    payload: profileResult
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
