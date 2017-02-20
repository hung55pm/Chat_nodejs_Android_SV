/**
 * Created by NGOCHUNG on 2/15/2017.
 */

var Yourinvitation = require('../models/yourinvitation');
var Friend = require('../models/friend');
var respone = require('../helppers/respones');
var async = require('async');
exports.sendfriendrequest = function (req, res) {
    console.log(req.body.friend_id + "   " + req.user.user_id);
    var friend_id = req.body.friend_id;
    async.waterfall([
        function (done) {
            Friend.findOne({user_id: req.user.user_id}, function (err, result) {
                if (err) {
                    console.log("find rq", err);
                    done(err);
                } else if (!result) {
                    console.log("find rq result", result);
                    var newfriendrq = Friend({
                        user_id: req.user.user_id,
                    });
                    var tmp = ({
                        friend_id: friend_id,
                        name: req.body.name,
                        status: 0,
                    });
                    newfriendrq.list.push(tmp);
                    console.log("aaa", JSON.stringify(newfriendrq));
                    newfriendrq.save(function (err) {
                        console.log("save rq0", err);
                        done(err);

                    });
                    done(null);
                } else {
                    if (!_contain(result.list, friend_id)) {
                        var tmp = ({
                            friend_id: friend_id,
                            name: req.body.name,
                            status: 0,
                        });
                        result.list.push(tmp);
                        result.save(function (err) {
                            console.log("save rq1", err);
                            done(err);

                        })

                    }
                    done(null);
                }

            });
        }, function (done) {

            Yourinvitation.findOne({user_id: friend_id}, function (err, result) {
                if (err) {
                    console.log("find y", err);
                    done(err);
                } else if (!result) {
                    var newfriendrq = Yourinvitation({
                        user_id: friend_id,
                    });
                    var tmp = ({
                        friend_id: req.user.user_id,
                        name: req.user.name,
                        status: 0,
                        message: "hi ban minh co the lam quen khong"
                    });
                    newfriendrq.list.push(tmp);
                    newfriendrq.save(function (err) {
                        console.log("save y1", err);
                        done(err);

                    });
                    done(null);
                } else {
                    if (!_contain(result.list, req.user.user_id)) {
                        var tmp = ({
                            friend_id: req.user.user_id,
                            name: req.user.name,
                            status: 0,
                            message: "hi ban minh co the lam quen khong"
                        });
                        result.list.push(tmp);
                        result.save(function (err) {
                            console.log("save y2", err);
                            done(err);

                        })
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

function find_invitation(arr, check_friend_id) {

    for (var i in arr) {
        if (arr[i].friend_id == check_friend_id)
            return arr[i].friend_id;
    }
    return null;
}


exports.replyfriendrequest = function (req, res) {
    var friend_id = req.body.friend_id;
    var status = req.body.status;
    console.log("data"+req.body.friend_id+"  "+req.body.name+"  "+req.body.status);
    async.waterfall([
        function (done) {
            //update status friend for user_id
            Friend.findOne({user_id: req.user.user_id}, function (err, result) {
                if (err ) {
                    console.log("find rq", err);
                    done(err);
                } if(!result){
                    var newfriendrq = Friend({
                        user_id: req.user.user_id,
                    });
                    var tmp = ({
                        friend_id: friend_id,
                        name: req.body.name,
                        status: status,
                    });
                    newfriendrq.list.push(tmp);
                    console.log("aaa", JSON.stringify(newfriendrq));
                    newfriendrq.save(function (err) {
                        console.log("save rq0", err);
                        done(err);

                    });
                    done(null);
                }else {
                    var friend_ids = find_invitation(result.list, req.body.friend_id);
                    console.log("sssss" + friend_ids);
                    if (friend_ids) {
                        for (var i = 0; i < result.list.length; i++) {
                            if (friend_ids == result.list[i].friend_id) {
                                result.list[i].status = status;
                                result.save(function (err) {
                                    console.log(err);
                                    done(err)
                                });
                            }
                        }
                    }else {
                        var tmp = ({
                            friend_id: friend_id,
                            name: req.body.name,
                            status: status,
                        });
                        result.list.push(tmp);
                        console.log("aaa", JSON.stringify(newfriendrq));
                        result.save(function (err) {
                            console.log("save rq0", err);
                            done(err);

                        });
                    }
                    done(null);
                }

            });
        }, function (done) {
            //update status friend for friend_id
            Friend.findOne({user_id: friend_id}, function (err, result) {
                if (err || !result) {
                    console.log("find rq", err);
                    done(err);
                } else {
                    var friend_ids = find_invitation(result.list, req.user.user_id);
                    console.log("sssss" + friend_ids);
                    if (friend_ids) {
                        for (var i = 0; i < result.list.length; i++) {
                            if (friend_ids == result.list[i].friend_id) {
                                result.list[i].status = status;
                                result.save(function (err) {
                                    console.log(err);
                                    done(err)
                                });
                            }
                        }
                    }
                    done(null);
                }

            });
        },function (done) {

            Yourinvitation.findOne({user_id: req.user.user_id}, function (err, result) {
                if (err || !result) {
                    done(err)
                } else {
                    var friend_ids = find_invitation(result.list, req.body.friend_id);
                    if (friend_ids) {
                        for (var i = 0; i < result.list.length; i++) {
                            console.log("aaaaaaa" + status + "   " + friend_ids);
                            if (friend_ids == result.list[i].friend_id) {
                                result.list[i].status = status;
                                result.save(function (err) {
                                    done(err)
                                });
                            }
                        }
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
            respone.res_successnoresult(200, " reply invitations to your success", false, res);
        }
    });


}

exports.getallinvitation = function (req, res) {
    console.log("sssss"+req.user.user_id);
    var user_id = req.user.user_id;
    var result = [];
        Yourinvitation.findOne({user_id: user_id}, function (err, acc) {
            if (err) {
                respone.res_error(400, "system err", true.res);
            } else if (!acc) {
                respone.res_success(200, "success", false, result, res);
            } else {
                if (acc.list.length == 0) {
                    respone.res_success(200, "success", false, result, res);
                } else {
                    for (var i = 0; i < acc.list.length; i++) {
                        if (acc.list[i].status == 0) {
                            var tmp = {
                                user_id: acc.list[i].friend_id,
                                name: acc.list[i].name,
                            }
                            result.push(tmp);
                        }
                    }

                }
                respone.res_success(200, "success", false, result, res);
            }


        });



}

exports.getallfriends=function (req,res) {
    var user_id = req.user.user_id;
    var result = [];
    Friend.findOne({user_id: user_id}, function (err, acc) {
        if (err) {
            respone.res_error(400, "system err", true.res);
        } else if (!acc) {
            respone.res_success(200, "success", false, result, res);
        } else {
            if (acc.list.length == 0) {
                respone.res_success(200, "success", false, result, res);
            } else {
                for (var i = 0; i < acc.list.length; i++) {
                    if (acc.list[i].status == 1) {
                        var tmp = {
                            user_id: acc.list[i].friend_id,
                            name: acc.list[i].name,
                        }
                        result.push(tmp);
                    }
                }

            }
            respone.res_success(200, "success", false, result, res);
        }


    });

}
