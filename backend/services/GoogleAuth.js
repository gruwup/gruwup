const {OAuth2Client} = require('google-auth-library');
CLIENT_ID="" //TODO will need to ask FE ppl about this (whoever set this thang up)

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
        verify().then(ticket => {
            return {userId: payload['sub'], payload: ticket.getPayload()};
        }
        ).catch(error => {
            return error //??
        });
    }
}

module.exports = GoogleAuth;