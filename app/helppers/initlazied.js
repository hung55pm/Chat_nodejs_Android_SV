/**
 * Created by tungxuan on 3/18/16.
 */

var async = require('async');
var Account = require('../models/account');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat-nodejs-mobile');


// Creat admin account + add States, Provinces data
module.exports = function () {

    Account.findOne({
        user_id: '01675647422'
    }, function (err, acc) {
        if (!err && !acc) {
            var admin = new Account({
                user_id: '01675647422',
            });
            admin.password = admin.generateHash('hung123');
            admin.save();

        }
    });

}


