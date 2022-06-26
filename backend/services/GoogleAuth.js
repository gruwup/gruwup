const {OAuth2Client} = require('google-auth-library');

CLIENT_ID="613845440821-5v295epa113l4fig6nm9vd3s249tfvch.apps.googleusercontent.com"

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
