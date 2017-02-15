/**
 * Created by NGOCHUNG on 2/15/2017.
 */

var FriendRequest = require('../models/friendrequest');
var Yourinvitation = require('../models/yourinvitation');
var respone = require('../helppers/respones');
var async = require('async');
exports.sendfriendrequest = function (req, res) {
    console.log(req.body.user_id + "   " + req.body.friend_id);
    var user_id = req.body.user_id;
    var friend_id = req.body.friend_id;
    async.waterfall([
        function (done) {
            FriendRequest.findOne({user_id: user_id}, function (err, frrq) {
                if (err) {
                    console.log("find rq", err);
                    done(err);
                } else if (!frrq) {
                    console.log("find rq result", frrq);
                    var newfriendrq = FriendRequest({
                        user_id: user_id,
                    });
                    var tmp = ({
                        friend_id: friend_id,
                        status: 0,
                        message: "hi ban minh co the lam quen khong"
                    });
                    newfriendrq.list.push(tmp);
                    console.log("aaa", JSON.stringify(newfriendrq));
                    newfriendrq.save(function (err) {
                        console.log("save rq0", err);
                        done(err);

                    })
                } else {
                    if (!_contain(frrq.list, friend_id)) {
                        var tmp = ({
                            friend_id: friend_id,
                            status: 0,
                            message: "hi ban minh co the lam quen khong"
                        });
                        frrq.list.push(tmp);
                        frrq.save(function (err) {
                            console.log("save rq1", err);
                            done(err);

                        })

                    }
                    done(null);
                }

            });
        }, function (done) {

            Yourinvitation.findOne({user_id: friend_id}, function (err, frrq) {
                if (err) {
                    console.log("find y", err);
                    done(err);
                } else if (!frrq) {
                    var newfriendrq = Yourinvitation({
                        user_id: friend_id,
                    });
                    var tmp = ({
                        friend_id: user_id,
                        status: 0,
                        message: "hi ban minh co the lam quen khong"
                    });
                    newfriendrq.list.push(tmp);
                    newfriendrq.save(function (err) {
                        console.log("save y1", err);
                        done(err);

                    });
                } else {
                    if(!_contain(frrq.list,user_id)) {
                        var tmp = ({
                            friend_id: user_id,
                            status: 0,
                            message: "hi ban minh co the lam quen khong"
                        });
                        frrq.list.push(tmp);
                        frrq.save(function (err) {
                            console.log("save y2", err);
                            done(err);

                        })
                    }else {

                    }
                    done(null);

                }

            });
        }
    ], function (err) {
        console.log(err)
        if (err) {
            respone.res_error(400, err, true, res);
        } else {
            respone.res_successnoresult(200, "send invitations to your success", false, res);
        }
    });

}
function _contain(arr, check_friend_id) {

    for (var i in arr) {
        if (arr[i].friend_id == check_friend_id)
            return true;
    }
    return false;
}


exports.answerfriendrequest = function (req, res) {


}
