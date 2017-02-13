var express = require('express');
var router = express.Router();
var Acount =require('../app/controller/account');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('');
});
function getAccessToken(req) {
    return req.get('Authorization').substring(13);
}
function isValidToken(req, res, next) {
    var accessToken = getAccessToken(req);
    mAccount.findOne({
        access_token: accessToken
    }, function (err, acc) {
        if (err || !acc) {
            resp.res_error(400,'invalid access token',true,res);
        } else {
            console.log(acc);
            req.user = acc;
            return next();
        }
    });
}
router.post('/login',Acount.login);
router.post('/register', Acount.register);
router.post('/logout',isValidToken, Acount.logout);
module.exports = router;
