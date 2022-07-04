const CryptoJS = require("crypto-js");

module.exports = class Session {
    static session = [];
    static name = "gruwup-session";
    static invalid_msg = "Invalid cookie";

    static createSession = (userId) => {
        var encrypt = CryptoJS.SHA256(userId + Date.now());
        var token = CryptoJS.enc.Hex.stringify(encrypt);
        this.session.push(this.name + "=" + token);
        return token;
    };
    
    static validSession = (token) => {
        return this.session.includes(token);
    };
    
    static deleteSession = (token) => {
        this.session = this.session.filter(item => item !== token);
    };
}