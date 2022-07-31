const {OAuth2Client} = require('google-auth-library');

//https://developers.google.com/identity/sign-in/web/backend-auth
const GoogleAuth = {
    validateToken: (token, client_id) => {
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
