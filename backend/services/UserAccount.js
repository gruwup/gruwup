const checkValidToken = (token) => {
    return true;
};

const getProfile = (userId) => {
    return {
        "userId": "string",
        "name": "Bob John",
        "biography": "I am a 20 year old living in Vancouver",
        "categories": [1, 2, 3]
      };
};

module.exports = {checkValidToken, getProfile}