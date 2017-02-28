var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./configs/database');
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: dbConfig.url}});
var session = require('express-session');
var mongoose = require('mongoose');
var init = require('./app/helppers/initlazied');
var index = require('./routes/index');
var apis = require('./routes/app');
var message=require('./app/controller/message');
message.socketlisten();
mongoose.Promise = global.Promise;
init();
var app = express();

var admin=require('./configs/filebase_admin');
admin.fcm_admin();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'chat-nodejs-mobile',
    resave: true,
    saveUninitialized: true
}));
app.use('/', index);
app.use('/api', apis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: "Not found",
            error: {}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: "not found",
        error: {}
    });
});


module.exports = app;
