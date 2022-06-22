const express = require("express");
const DataValidator = require("../constants/DataValidator");
const GoogleAuth = require("../services/GoogleAuth");
const UserAccount = require("../services/UserAccount");
const Session = require("../services/Session");
const router = express.Router();

router.post("/sign-in", (req, res) => {
    req.body.authentication_code = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiMDllNzQ0ZDU4Yzk5NTVkNGYyNDBiNmE5MmY3YjM3ZmVhZDJmZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2ODk5NTY1MjExODAtN2huZzgxODQ3cDBuNzVhaDdtYjVuZmI4ZGljbTZvbW4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2ODk5NTY1MjExODAtcmpzMWhqaGUybG9kaWpwdWowNjVqdG5lMGl2aDUzMGQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI4NTczMzAyOTM0MDk5MTg5MTQiLCJlbWFpbCI6Inlhc3VvY2FycnkyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImJvYiBsZWUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2prbjNYNTJRX3B6MGxMejg4VXBPWjlCOEk3b05hUERfam1VWjh5PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImJvYiIsImZhbWlseV9uYW1lIjoibGVlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTU4NzU2MzMsImV4cCI6MTY1NTg3OTIzM30.bIcauzr5hfmf--Ky7YwnuQtNn3_A-4jZmWflY0v15yKtFH4k7yEl3cJx4xWRj1BzYz2fL-j5Y-DHlm0ok10FlRjdhHuiDHryyFHRRND40k8U18D1lELi-QFnq7pLPSBDFS_Y3TNJJUdYn85tuz2MHqSdNpTkGDFFy0ItuC3hDsNLTLBB5wrkDav7u4r4-GX9uZOmJbBiuzGS21YTBUUqYoN8k0j_tmK0fPxZ3GCQY675dIZnqt8PQStWM4tarjjahaCzQKty4fnwnvzqx3nucKUiS00LPcvSTqjtv1SaajwLPZbwj65BuscbNZeF8LNjcck35kkRGUplHrHpFbPjgQ"
    UserAccount.checkValidToken(req.body.authentication_code).then((err, response) => {
        //create cookie and send it back to user
        if (err) {
            console.log("error" + err);
        }
        else if (!user) {
            res.status(404).send({userId: user.userId, userExists: false});
        }
        else {
            res.status(200).send({userId: user.userId, userExists: true});
        }
    })
    .catch(error => {
        console.log("account2" + error);
    });
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