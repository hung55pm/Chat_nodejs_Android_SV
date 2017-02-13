/**
 * Created by NGOCHUNG on 12/29/2016.
 */
var async = require('async');
var fs = require('fs');
var Account = require('../models/account');
var UUID = require('node-uuid');
var mongoose = require('mongoose');
var respone=require('../helppers/respones');


exports.login = function (req, res) {
    console.log("aaaaaa"+JSON.stringify(req.body));
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
            respone.res_error(500,'system error',true,res);
        }
        else if (!acc) {
            respone.res_error(500,'Account does not exist ',true,res);
        }
        else if (!acc.validPassword(req.body.password)) {
            respone.res_error(500,'The password is invalid',true,res);
        } else {
            var tmp=({
                pemission: acc.role,
                access_token: acc.access_token
            });
            respone.res_success(200,'success',false,tmp,res);

        }
    });
}
exports.register = function (req, res) {
    if (!req.body.phone || !req.body.name || !req.body.address
        || !req.body.email || !req.body.password) {
        res.json({code: 400, message: 'one or more parameters is missing'});
    } else {
        var newAccount = new Account({
            user_id: req.body.phone.toLowerCase(),
            name: req.body.name,
            birthday: req.body.birthday,
            address: req.body.address,
            phone: req.body.phone,
            role:2,
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
                res.json({code:500, message: err});
            } else {
                res.json({code: 200, message:'success'});
            }
        });
    }
}
exports.changepassword =function (req,res) {
    if(!req.body.phone || !req.body.newpassword || !req.body.oldpassword ){
        res.json({code: 400, message: 'one or more parameters is missing'});
    }else {
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
exports.logout = function (req,res) {
        var accessToken = getAccessToken(req);
    console.log("aaaaa"+accessToken);
        Account.findOneAndUpdate({
            access_token: accessToken
        }, {
            access_token: UUID.v4()
        }, function (err, acc) {
            if (err || !acc) {
                respone.res_error(400,"logout fail",true,res);
            }
            respone.res_success(200,"logout success",false,"",res);
        });


}