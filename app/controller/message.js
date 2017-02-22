/**
 * Created by MR_HUNG on 2/14/2017.
 */

var http = require('../../configs/socketio_configs');
var io = require('socket.io')(http.httplistens());
var Message = require('../models/message');
exports.socketlisten = function (req, res) {
    io.on('connection', function (socket) {
        console.log('a user connected ');

        socket.on('connect1vs1', function (msg) {
            //var tmp= JSON.parse(msg);
            console.log("connect1vs1: " + msg);
            var tmp = msg.split(" ");
            Message.findOne({
                $or: [{room_id: tmp[0] + tmp[1]},
                    {room_id: tmp[1] + tmp[0]}]
            }, function (err, mes) {
                if (err) {
                    var json={
                        code:400,
                        message:"fail"

                    }
                    io.emit(tmp[0],json );
                } else if (!mes) {

                    var mess= new Message({
                       room_id: tmp[0] + tmp[1],
                        list:[]
                    })

                    mess.save(function (err) {
                        console.log("save err: "+err)
                    })
                    var json={
                        code:200,
                        message:"success",
                        result:mess

                    }
                    io.emit(tmp[0], json);
                } else {
                    var json={
                        code:200,
                        message:"success",
                        result:mes

                    }
                    io.emit(tmp[0], json);
                }

            });
            console.log("connect1vs1: " + tmp);

        });


        socket.on("chat1vs1",function (msg) {
            var tmp= JSON.parse(msg);
            console.log(tmp);
            Message.findOne({room_id:tmp.room_id},function (err,result) {
                if(err){

                }else  if(!result){

                }else {

                }

            });

        })

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}





