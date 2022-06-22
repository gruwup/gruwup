const {OAuth2Client} = require('google-auth-library');

CLIENT_ID="689956521180-rjs1hjhe2lodijpuj065jtne0ivh530d.apps.googleusercontent.com"

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