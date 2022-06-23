const Profile = require("../models/Profile");

const findUser = (userId) => {
    return Profile.findOne({ userId: userId });
};

const getUserProfile = (userId) => {

};

const createUser = (profile) => {

};

const updateUser = (profile) => {

};

module.exports = {findUser, }