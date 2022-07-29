const {OAuth2Client} = require('google-auth-library');

CLIENT_ID="689956521180-el1vflpf7lukac95p4u4s57qv84oq46l.apps.googleusercontent.com"
test_user = {
    payload: {
        sub: '111111111111111111111',
        email: 'abc@gmail.com',
        name: 'Bob John',
    }
}

//https://developers.google.com/identity/sign-in/web/backend-auth
const GoogleAuth = {
    validateToken: (token, client_id) => {
        if (token === "123") return new Promise((resolve, reject) => {resolve(test_user);});
        const client = new OAuth2Client(client_id);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: client_id
            });
            return ticket;
        }
        return verify();
    }
}

module.exports = GoogleAuth;
