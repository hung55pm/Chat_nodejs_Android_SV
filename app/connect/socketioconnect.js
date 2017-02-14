/**
 * Created by MR_HUNG on 2/12/2017.
 */
var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);
var fs=require('fs');
http.listen(4000, function(){
    console.log('listening on *:4000');
});
exports.socketlisten=function () {
    io.on('connection', function(socket){
        console.log('a user connected ');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}
