/**
 * Created by MR_HUNG on 2/14/2017.
 */

var http = require('../../configs/socketio_configs');
var async = require('async');
var io = require('socket.io')(http.httplistens());
var Message = require('../models/message');
var MesRecent = require('../models/messagerecent');
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
                        result: mess

                    }
                    io.emit(tmp[0], json);
                } else {
                    var json = {
                        code: 200,
                        message: "success",
                        result: mes

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
                MesRecent.find({
                    $or: [{
                        user_id: getid[0],
                        user_id: getid[1]
                    }]
                }).exec(function (err, result) {
                    if (err) {
                        done(err);
                    } else if (!result) {
                        var setid0 = new MesRecent({
                            user_id: getid[0]
                        });
                        var setid1 = new MesRecent({
                            user_id: getid[1]
                        });
                        var list0 = {
                            room_id: tmp.room_id,
                            person_id: tmp.user_id,
                            name: tmp.name,
                            message: tmp.message,
                            date: tmp.create_date
                        }
                        var list1 = {
                            room_id: tmp.room_id,
                            person_id: tmp.user_id,
                            name: tmp.name,
                            message: tmp.message,
                            date: tmp.create_date
                        }
                        setid0.list.push(list0);
                        setid1.list.push(list1);
                        setid0.save();
                        setid1.save();
                        done(null);

                    } else {
                        var check0=_contain(result,getid[0]);
                        var check1=_contain(result,getid[1]);
                        if(check0){
                            var recent0= _containrecent(check0.list,tmp.room_id);
                            var clist0 = {
                                room_id: tmp.room_id,
                                person_id: tmp.user_id,
                                name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            if(recent0){
                                // update new message to message recent

                            }else {

                            check0.list.push(clist0);
                            check0.save();
                            }
                        }else {
                            var setid00 = new MesRecent({
                                user_id: getid[0]
                            });
                            var clist0 = {
                                room_id: tmp.room_id,
                                person_id: tmp.user_id,
                                name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            setid00.list.push(clist0);
                            setid00.save();
                        }
                        if(check1){
                            var recent1= _containrecent(check1.list,tmp.room_id);
                            var clist1 = {
                                room_id: tmp.room_id,
                                person_id: tmp.user_id,
                                name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            if(recent1){
                                // update new message to message recent
                            }else {
                                check1.list.push(clist1);
                                check1.save();
                            }
                        }else {
                            var setid01 = new MesRecent({
                                user_id: getid[1]
                            });
                            var clist1 = {
                                room_id: tmp.room_id,
                                person_id: tmp.user_id,
                                name: tmp.name,
                                message: tmp.message,
                                date: tmp.create_date
                            }
                            setid01.list.push(clist1);
                            setid01.save();
                        }
                        done(null);
                    }
                })
            }], function (err) {
                if(err){
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
function _containrecent(arr, check_id) {

    for (var i in arr) {
        if (arr[i].room_id == check_id)
            return arr[i];
    }
    return false;
}





