const express = require("express");
const DataValidator = require("../constants/DataValidator");
const GoogleAuth = require("../services/GoogleAuth");
const router = express.Router();

// TODO: need database to store profile information based on user token

// can delete this later, just for early testing
const example = {
    "userId": "string",
    "name": "Bob John",
    "biography": "I am a 20 year old living in Vancouver",
    "categories": [1, 2, 3]
  }

router.post("/sign-in", (req, res) => {
    try {

        key = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiMDllNzQ0ZDU4Yzk5NTVkNGYyNDBiNmE5MmY3YjM3ZmVhZDJmZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2ODk5NTY1MjExODAtN2huZzgxODQ3cDBuNzVhaDdtYjVuZmI4ZGljbTZvbW4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2ODk5NTY1MjExODAtcmpzMWhqaGUybG9kaWpwdWowNjVqdG5lMGl2aDUzMGQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI4NTczMzAyOTM0MDk5MTg5MTQiLCJlbWFpbCI6Inlhc3VvY2FycnkyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImJvYiBsZWUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2prbjNYNTJRX3B6MGxMejg4VXBPWjlCOEk3b05hUERfam1VWjh5PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImJvYiIsImZhbWlseV9uYW1lIjoibGVlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTU3OTA2MTYsImV4cCI6MTY1NTc5NDIxNn0.jU3mHDvbYIrRFEZL1LWCZWfa9Ike1bWROuC6pcLOsydcPyEsyFF1zZI4i5qSEl3nWGpw7myV7CTpQRGWIOV4hhGhdlRhP0vEU73TL1nQ_kyEciZfAsWfh_GkwUzKFCQP0nXpY2wm14fU3TElEPYkwVNnGsCdN3dQPN-zNvQNipYuaapaMa1vPtpq5QuGc4TFOftglGFMGgZPZpgZl3qF5EEf_ithc8AfKkCopeL3RySB106DqadygU-pQMb4U2qLaS8Yaa-JN7o7ZpC444m34tKrmGo7p0Lbmq9n7KMGvk72z7KyL0UKqLpA5M2cpQTAocLaSTq1hkPKm68oQYT4mw'
        // var response = GoogleAuth.validateToken(req.body.authentication_code);
        GoogleAuth.validateToken(key).then(response => {
            payload = response.getPayload();
            var userInfo = {
                userId: response.payload['sub'],
                userExists: false // replace after checking if user exists in database
            }
            res.status(200).send(userInfo);
        }).catch(error => {
            res.sendStatus(400).send(error);
        })
        // do something to check response? and get fields from google if verified
    }
    catch {
        res.sendStatus(400);
    }
});

router.post("/sign-out", (req, res) => { //change
    if (DataValidator.isTokenValid(req.body.userId)) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;