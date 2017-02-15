/**
 * Created by NGOCHUNG on 2/14/2017.
 */
var express = require('express');
var http = require('http').Server(express);
exports.httplistens=function () {
    http.listen(4000, function(){
        console.log('listening on *:4000');
    });

    return http;

}
