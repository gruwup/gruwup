// This file is used for testing purposes only
const axios = require('axios').default;
const app = require('../app');
const data = {
    client_id: "689956521180-32cf3ep88st89u27u5jnq7g32ve9ijp5.apps.googleusercontent.com",
    client_secret: "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",
    refresh_token: "1//04yKt2ScY7a8GCgYIARAAGAQSNwF-L9IrzZZxJVFYw-MrS-0G1CzLDh-SXqfWXq85bc0eKcq68eGxaCjIq0wNIUvJgQYPlYikr9E",
    grant_type: "refresh_token"
}

module.exports = class TestSessions {
    static generateTestToken = async () => {
        return axios.post("https://www.googleapis.com/oauth2/v4/token", data).then(function (response) {
            return response.data.id_token;
        }).catch(function (error) {
            return error;
        });
    }

    static getSessionCookie = async () => {
        return axios.post("http://localhost:8081/account/sign-in", {
            authentication_code: await this.generateTestToken(),
            client_id: "689956521180-32cf3ep88st89u27u5jnq7g32ve9ijp5.apps.googleusercontent.com"
        }).then(function (result) {
            return result.response.headers['set-cookie'][0].split(';')[0];
        }).catch(function (error) {
            return error.response.headers['set-cookie'][0].split(';')[0];
        });
    }

    static client_id = "689956521180-32cf3ep88st89u27u5jnq7g32ve9ijp5.apps.googleusercontent.com";
}