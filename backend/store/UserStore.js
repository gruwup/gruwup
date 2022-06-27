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
        result.adventureId = result._id;
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

const updateUser = (profile) => {

};

module.exports = {findUser, getUserProfile, createUser, updateUser};
