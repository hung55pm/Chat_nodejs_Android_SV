/**
 * Created by MR_HUNG on 2/14/2017.
 */

var http = require('../../configs/socketio_configs');
var async = require('async');
var io = require('socket.io')(http.httplistens());
var Message = require('../models/message');
var MesRecent = require('../models/messagerecent');
var Acount = require('../models/account');
var respon= require('../helppers/respones');
var fcm=require('../../configs/filebase_admin');
exports.socketlisten = function (req, res) {
    io.on('connection', function (socket) {
        console.log('a user connected ');

        socket.on('connect1vs1', function (msg) {
            //var tmp= JSON.parse(msg);
            console.log("connect1vs1: " + msg);
            var tmp = msg.split("-");
            Message.findOne({
                $or: [{room_id: tmp[0] + "-" + tmp[1]},
                    {room_id: tmp[1] + "-" + tmp[0]}]
            }, function (err, mes) {
                if (err) {
                    var json = {
                        code: 400,
                        message: "fail"

                    }
                    io.emit(tmp[0], json);
                } else if (!mes) {

                    var mess = new Message({
                        room_id: tmp[0] + "-" + tmp[1],
                        list: []
                    })

                    mess.save(function (err) {
                        console.log("save err: " + err)
                    })
                    var json = {
                        code: 200,
                        message: "success",
                        room_id: tmp[0] + "-" + tmp[1]

                    }
                    io.emit(tmp[0], json);
                } else {
                    var json = {
                        code: 200,
                        message: "success",
                        room_id: mes.room_id

                    }
                    io.emit(tmp[0], json);
                }

            });
            console.log("connect1vs1: " + tmp);

        });


        socket.on("chat1vs1", function (msg) {
            var tmp = JSON.parse(msg);
            var getid = tmp.room_id.split("-");
            console.log(tmp);
            async.waterfall([function (done) {
                Message.findOne({room_id: tmp.room_id}, function (err, result) {
                    if (err) {
                        done(err);
                    } else if (!result) {
                        var mess = new Message({
                            room_id: tmp.room_id,
                            list: []
                        })

                        mess.save(function (err) {
                            console.log("save err: " + err)
                        })
                        var json = {
                            code: 200,
                            message: "success",
                            result: {}

                        }
                        io.emit(tmp.room_id, json);
                        done(null);
                    } else {
                        var detail = {
                            user_id: tmp.user_id,
                            name: tmp.name,
                            message: tmp.message,
                            date: tmp.create_date
                        }
                        result.list.push(detail);
                        result.save(function (err) {

                        })
                        var json = {
                            code: 200,
                            message: "success",
                            result: detail

                        }
                        io.emit(tmp.room_id, json);
                    }
                    done(null);

                });
            }, function (done) {
                var friend_name0,friend_name1;
                var token0=[],token1=[];
                async.parallel([function (callback) {
                    Acount.findOne({user_id : getid[1]},function (err, acc) {
                        console.log("vvvvv"+acc);
                        if(err || !acc){
                            friend_name0="admin";
                            token0=[];
                            return callback(null);
                        }else {
                            friend_name0=acc.name;
                            token0=acc.noitification_list;
                            return callback(null);
                        }


                    });

                },function (callback) {
                    Acount.findOne({user_id : getid[0]},function (err, acc) {
                        console.log("vvvvv"+acc);
                        if(err || !acc){
                            friend_name1="admin";
                            token1=[];
                        }else {
                            friend_name1=acc.name;
                            token1=acc.noitification_list;

                        }
                        var detail = {
                            user_id: tmp.user_id,
                            name: tmp.name,
                            message: tmp.message,
                            date: tmp.create_date
                        }

                        if(tmp.user_id==getid[0]){
                            if(token0.length>0){
                                for (var i=0;i<token0.length;i++){
                                    fcm.push_noitification_single(detail.toString(),"tin nhan moi",token0[i].fcm_token);
                                }
                            }
                        }else if(tmp.user_id==getid[1]) {
                            if(token1.length>0){
                                for (var i=0;i<token1.length;i++){
                                    fcm.push_noitification_single(detail.toString(),"tin nhan moi",token1[i].fcm_token);
                                }
                            }
                        }

                        return callback(null);
                    });
                },function (callback) {

                    console.log("aaa"+friend_name1+"  "+friend_name0);
                    MesRecent.find({
                        $or: [{
                            user_id: getid[0]},
                            { user_id: getid[1]
                            }]
                    }).exec(function (err, result) {

                        if (err) {
                            callback(err);
                        } else if (!result) {
                            var setid0 = new MesRecent({
                                user_id: getid[0],
                            });
                            var setid1 = new MesRecent({
                                user_id: getid[1],
                            });

                            var list0 = {
                                room_id: tmp.room_id,
                                friend_name: friend_name0,
                                sender_id: tmp.user_id,
                                sender_name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            var list1 = {
                                room_id: tmp.room_id,
                                friend_name: friend_name1,
                                sender_id: tmp.user_id,
                                sender_name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            setid0.list.push(list0);
                            setid1.list.push(list1);
                            setid0.save();
                            setid1.save();
                            callback(null);

                        } else {
                            var check0 = _contain(result, getid[0]);
                            var item0= _containposition(result, getid[0]);
                            var check1 = _contain(result, getid[1]);
                            var item1= _containposition(result, getid[1]);
                            if (check0) {
                                var recent0 = _containrecent(check0.list, tmp.room_id);
                                var clist000 = {
                                    room_id: tmp.room_id,
                                    friend_name: friend_name0,
                                    sender_id: tmp.user_id,
                                    sender_name: tmp.name,
                                    message: tmp.message,
                                    date: tmp.create_date
                                }
                                if (recent0) {
                                    // update new message to message recent
                                    var position = _containitem(check0.list, tmp.room_id);
                                    if (position) {
                                        result[item0].list[position]=clist000;
                                        result[item0].save();
                                    }

                                } else {
                                    result[item0].list.push(clist000);
                                    result[item0].save();
                                }
                            } else {
                                var setid00 = new MesRecent({
                                    user_id: getid[0],
                                });
                                var clist0 = {
                                    room_id: tmp.room_id,
                                    friend_name: friend_name0,
                                    sender_id: tmp.user_id,
                                    sender_name: tmp.name,
                                    message: tmp.message,
                                    date: tmp.create_date
                                }
                                setid00.list.push(clist0);
                                setid00.save();
                            }
                            if (check1) {
                                var recent1 = _containrecent(check1.list, tmp.room_id);
                                var clist100 = {
                                    room_id: tmp.room_id,
                                    friend_name: friend_name1,
                                    sender_id: tmp.user_id,
                                    sender_name: tmp.name,
                                    message: tmp.message,
                                    date: tmp.create_date
                                }
                                if (recent1) {
                                    var position = _containitem(check1.list, tmp.room_id);
                                    if (position) {
                                        result[item1].list[position]=clist100;
                                        result[item1].save();
                                    }
                                    // update new message to message recent
                                } else {
                                    result[item1].list.push(clist100);
                                    result[item1].save();
                                }
                            } else {
                                var setid01 = new MesRecent({
                                    user_id: getid[1],
                                });
                                var clist1 = {
                                    room_id: tmp.room_id,
                                    friend_name: friend_name1,
                                    sender_id: tmp.user_id,
                                    sender_name: tmp.name,
                                    message: tmp.message,
                                    date: tmp.create_date
                                }
                                setid01.list.push(clist1);
                                setid01.save();
                            }
                            callback(null);
                        }
                    })
                }],function (err) {
                    if(err){
                        done(err);
                    }else {
                        done(null);
                    }

                })



            }], function (err) {
                if (err) {
                    var json = {
                        code: 400,
                        message: "fail"

                    }
                    io.emit(tmp.room_id, json);
                }

            })


        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}
function _contain(arr, check_friend_id) {

    for (var i in arr) {
        if (arr[i].user_id == check_friend_id)
            return arr[i];
    }
    return false;
}
function _containposition(arr, check_friend_id) {

    for (var i in arr) {
        if (arr[i].user_id == check_friend_id)
            return i;
    }
    return false;
}
function _containrecent(arr, check_id) {

    for (var i in arr) {
        if (arr[i].room_id == check_id)
            return arr[i];
    }
    return false;
}
function _containitem(arr, check_id) {

    for (var i in arr) {
        if (arr[i].room_id == check_id)
            return i;
    }
    return false;
}


exports.getmessagedetail= function (req,res) {
    var listmes=[];
    Message.findOne({room_id:req.body.room_id},function (err, mes) {
        if(err || !mes){
            respon.res_error(400,"system err",true,res);
        }else {
            respon.res_success(200,"success",false,mes.list,res);
        }
    })
}






