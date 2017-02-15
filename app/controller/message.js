/**
 * Created by MR_HUNG on 2/14/2017.
 */

var http=require('../../configs/socketio_configs');
var io = require('socket.io')(http.httplistens());
exports.socketlisten=function (req,res) {
    io.on('connection', function(socket){
        console.log('a user connected ');

        socket.on('new message', function(msg){
            console.log('message: ' + msg);
            var tmp= JSON.parse(msg);
            io.emit('new message', tmp);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}
