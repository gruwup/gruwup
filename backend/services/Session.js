const CryptoJS = require("crypto-js");
const session = {};
const name = "gruwup-session";

const createSession = (userId) => {
    var encrypt = CryptoJS.SHA256(userId + Date.now());
    var token = CryptoJS.enc.Hex.stringify(encrypt);
    session[name + "=" + token] = userId;
    return token;
}

const getSessionInfo = (token) => {
    return session[token];
}

const deleteSession = (token) => {
    delete session[token];
}

module.exports = {createSession, deleteSession, getSessionInfo, name};