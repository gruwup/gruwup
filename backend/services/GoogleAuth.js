const {OAuth2Client} = require('google-auth-library');

// CHANGE TO WHATEVER IS IN DA FE...
CLIENT_ID=""

//https://developers.google.com/identity/sign-in/web/backend-auth
const GoogleAuth = {
    validateToken: (token) => {
        const client = new OAuth2Client(CLIENT_ID);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            return ticket;
        }
        return verify();
    }
}

module.exports = GoogleAuth;