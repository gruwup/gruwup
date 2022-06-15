const {OAuth2Client} = require('google-auth-library');

//https://developers.google.com/identity/sign-in/web/backend-auth
const GoogleAuth = {
    validateToken: (token) => {
        
        const client = new OAuth2Client(CLIENT_ID);
        async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        }
        verify().catch(console.error);
    }
}

module.exports = GoogleAuth;