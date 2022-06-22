const GoogleAuth = require("./GoogleAuth");
const UserStore = require("../store/UserStore");

const checkValidToken = (token) => {
    return GoogleAuth.validateToken(token).then(response => {
        return UserStore.findUser(response.payload['sub']);
    }).catch(error => {
        return error;
    })
};

const getProfile = (userId) => {
    return {
        "userId": "string",
        "name": "Bob John",
        "biography": "I am a 20 year old living in Vancouver",
        "categories": [1, 2, 3]
      };
};

const createProfile = (profile) => {

};

const updateProfile = (profile) => {
    
};

module.exports = {checkValidToken, getProfile, createProfile, updateProfile}