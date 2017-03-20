var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var Account = require('./models/account')

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        Account.findById(id).exec(function (err, user) {
                done(err, user);
            });
    });
    passport.use('local-login', new LocalStrategy({
            usernameField: 'user_id',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, employeeCode, password, done) {
            Account.findOne({
                $or: [{
                    'user_id': employeeCode.toUpperCase()
                }, {
                    'user_id': employeeCode
                }],
            }).exec(function (err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'Mã nhân viên không tồn tại'));
                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Mật khẩu sai'));
                    return done(null, user);
                });
        }));
}
