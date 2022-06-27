const Profile = require("../models/Profile");

const findUser = (userId) => {
    return Profile.findOne({ userId: userId });
};

const getUserProfile = async (userId) => {
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

const createUser = async (profile) => {
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

const updateUser = async (userId, profile) => {
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

module.exports = {findUser, getUserProfile, createUser, updateUser};
