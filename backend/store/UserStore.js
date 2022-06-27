const Profile = require("../models/Profile");

const findUser = (userId) => {
    return Profile.findOne({ userId: userId });
};

const getUserProfile = (userId) => {

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
            code: 400,
            message: err
        };
    }
};

const updateUser = (userId, profile) => {
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
