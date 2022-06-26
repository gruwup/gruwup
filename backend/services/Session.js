const CryptoJS = require("crypto-js");
const session = [];
const name = "gruwup-session";

const createSession = (userId) => {
    var encrypt = CryptoJS.SHA256(userId + Date.now());
    var token = CryptoJS.enc.Hex.stringify(encrypt);
    session.push(name + "=" + token);
    return token;
}

const validSession = (token) => {
    console.log(session);
    return session.includes(token);
}

const deleteSession = (token) => {
    session.filter(item => {item == token})
}

module.exports = {createSession, deleteSession, validSession, name};