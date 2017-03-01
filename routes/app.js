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
    //console.log(accessToken)
        mAcount.findOne({
        access_token: accessToken
    }, function (err, acc) {
        if (err || !acc) {
            respone.res_error(400,'invalid access token',true,res);
        } else {
            req.user = acc;
            return next();
        }
    });
}
function checkValidToken(req, res, next) {
    var accessToken = getAccessToken(req);
    //console.log(accessToken)
    mAcount.findOne({
        access_token: accessToken
    }, function (err, acc) {
        if (err || !acc) {
            respone.res_error(400,'invalid access token',true,res);
        } else {
            respone.res_successnoresult(200,'success',false,res);
        }
    });
}
router.post('/login',Acount.login);
router.post('/register', Acount.register);
router.post('/logout',isValidToken, Acount.logout);
router.post('/add-friend',isValidToken,Friend.sendfriendrequest);
router.post('/friend-reply',isValidToken,Friend.replyfriendrequest);
router.post('/search-friend',isValidToken,Acount.searchfriend);
router.post('/getall-invitaion',isValidToken, Friend.getallinvitation);
router.post('/getall-friend',isValidToken, Friend.getallfriends);
router.post('/get-mesrecent',isValidToken, Friend.getMessageRecent);
router.post('/get-mes-detail',isValidToken, Message.getmessagedetail);
router.post('/request',checkValidToken);
module.exports = router;
