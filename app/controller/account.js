/**
 * Created by NGOCHUNG on 12/29/2016.
 */
var async = require('async');
var fs = require('fs');
var Account = require('../models/account');
var UUID = require('node-uuid');
var mongoose = require('mongoose');
var Friends=require('../models/friend')
var respone = require('../helppers/respones');


exports.login = function (req, res) {
    console.log("aaaaaa" + JSON.stringify(req.body));
    var userid = req.body.phone;
    var password = req.body.password;
    Account.findOne({
        $or: [{
            'user_id': userid.toUpperCase()
        }, {
            'user_id': userid
        }]
    }, function (err, acc) {
        if (err) {
            respone.res_error(500, 'system error', true, res);
        }
        else if (!acc) {
            respone.res_error(500, 'Account does not exist ', true, res);
        }
        else if (!acc.validPassword(req.body.password)) {
            respone.res_error(500, 'The password is invalid', true, res);
        } else {
            var tmp = ({
                access_token: acc.access_token,
                user_id:acc.user_id
            });
            respone.res_success(200, 'success', false, tmp, res);

        }
    });
}
exports.register = function (req, res) {
    if (!req.body.phone || !req.body.name
        || !req.body.email || !req.body.password) {
        res.json({code: 400, message: 'one or more parameters is missing'});
    } else {
        var newAccount = new Account({
            user_id: req.body.phone.toLowerCase(),
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        });
        newAccount.password = newAccount.generateHash(req.body.password);
        newAccount.access_token = UUID.v4();
        async.waterfall([
            //check account exist
            function (done) {
                Account.findOne({
                    user_id: req.body.phone.toLowerCase()
                }, function (err, acc) {
                    if (err) done(err);
                    else if (acc) done('phone number already exist');
                    else done(null);
                });
            },
            //save accounts
            function (done) {
                newAccount.save(function (err) {
                    done(err);
                });
            },
        ], function (err) {
            if (err) {
                res.json({code: 500, message: err});
            } else {
                res.json({code: 200, message: 'success'});
            }
        });
    }
}
exports.changepassword = function (req, res) {
    if (!req.body.phone || !req.body.newpassword || !req.body.oldpassword) {
        res.json({code: 400, message: 'one or more parameters is missing'});
    } else {
        var newAccount = new Account();
        Account.findOne({
            user_id: req.body.phone
        }, function (err, acc) {
            if (err) {
                res.json({
                    code: 500,
                    message: err
                });
            } else if (!acc.validPassword(req.body.oldpassword)) {
                res.json({
                    code: 500,
                    message: 'the old password is wrong'
                });
            } else {
                acc.password = acc.generateHash(req.body.newpassword);
                acc.save(function (err) {
                    if (err) {
                        res.json({
                            code: 500,
                            message: err
                        });
                    } else {
                        res.json({
                            code: 200,
                            message: "success"
                        });
                    }
                });
            }
        });
    }
}
function getAccessToken(req) {
    return req.get('Authorization').substring(13);
}
exports.logout = function (req, res) {
    var accessToken = getAccessToken(req);
    console.log("aaaaa" + accessToken);
    Account.findOneAndUpdate({
        access_token: accessToken
    }, {
        access_token: UUID.v4()
    }, function (err, acc) {
        if (err || !acc) {
            respone.res_error(400, "logout fail", true, res);
        }
        respone.res_success(200, "logout success", false, "", res);
    });


}
exports.searchfriend = function (req, res) {
    var friend_id = req.body.phone;
    var tmp=[];
    var tmpfr=false;
    if (friend_id==req.user.user_id) {
        respone.res_success(200, "success", false, tmp, res)
    } else {
        async.waterfall([function (done) {
            Account.findOne({user_id: friend_id}, function (err, acc) {
                if (err) {
                    done(err);
                    //respone.res_error(400, "system err", true, res);
                } else {
                    if (!acc) {
                        done(null);
                        //respone.res_success(200, "success", false, tmp, res)
                    } else {
                        var result = {
                            user_id: acc.user_id,
                            name: acc.name,
                        }
                        tmp.push(result);
                        done(null);
                       // respone.res_success(200, "success", false, tmp, res)
                    }


                }

            });
        },function (done) {
            Friends.findOne({user_id: req.user.user_id},function (err, acc) {
                if(err){
                    done(err);
                }else if(!acc){
                    done(null)
                }else {
                    if(_contain(acc.list,friend_id)){
                        tmpfr=true
                    }else {
                        tmpfr=false;
                    }
                    done(null)
                }
            })
        }],function (err) {
            if(err){
                respone.res_error(400, "system err", true, res);
            }else {
                if(tmpfr){
                    respone.res_success(300, "success", false, tmp, res)
                }else {
                    respone.res_success(200, "success", false, tmp, res)
                }
            }
        })

    }
}
function _contain(arr, check_friend_id) {

    for (var i in arr) {
        if (arr[i].friend_id == check_friend_id)
            return true;
    }
    return false;
}