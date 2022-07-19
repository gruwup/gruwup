const Adventure = require("../models/Adventure");
const Profile = require("../models/Profile");

module.exports = class User {
    static getUserProfile = async (userId) => {
        var profileResult = await Profile.findOne({ userId });
        if (!profileResult) {
            return {
                code: 404,
                message: "User Profile not found"
            }
        }

        var adventuresResult = await Adventure.find({ owner: userId });
        var adventures = [];
        adventuresResult.forEach(adventure => adventures.push(adventure));
        var result = { 
            userId: profileResult.userId,
            name: profileResult.name,
            biography: profileResult.biography,
            categories: profileResult.categories,
            image: profileResult.image,
            adventuresCreated: adventures };

        return {
            code: 200,
            message: "User Profile found",
            payload: result
        }
    };
    
    static createUser = async (profile) => {
        var user = new Profile(profile);
        var exists = await Profile.findOne({ userId: profile.userId });
        if (!exists) {
            var result = await user.save();

            return {
                code: 200,
                message: "Profile created successfully",
                payload: result
            };
        }
        else {
            return {
                code: 400,
                message: "Profile exists for userId",
                payload: result
            };
        }
    };
    
    static updateUser = async (userId, profile) => {
        var result = await Profile.findOneAndUpdate(
            { userId },
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
    };
};
