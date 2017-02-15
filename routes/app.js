var express = require('express');
var router = express.Router();
var Acount =require('../app/controller/account');
var Message=require('../app/controller/message');
var Friend=require('../app/controller/friend');
var mAcount=require('../app/models/account');
var respone=require('../app/helppers/respones');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('');
});
function getAccessToken(req) {
    return req.get('Authorization').substring(13);
}
function isValidToken(req, res, next) {
    var accessToken = getAccessToken(req);
    console.log(accessToken)
        mAcount.findOne({
        access_token: accessToken
    }, function (err, acc) {
        if (err || !acc) {
            respone.res_error(400,'invalid access token',true,res);
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
router.post('/friend-request',isValidToken,Friend.sendfriendrequest);
module.exports = router;
