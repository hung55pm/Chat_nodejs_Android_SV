var express = require('express');
var Friend=require('../app/controller/friend');
/* GET home page. */
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated())  res.redirect('/login');
  else return next();
}
module.exports = function (app, passport) {
  app.get('/login', function (req, res, next) {
    if (req.user) {
      res.redirect('/');
    } else {
      res.render('login', {
        message: req.flash('loginMessage')
      });
    }
  });

  app.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, infor) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        var redirect_to = '/';
        if (req.session.redirect_to) {
          redirect_to = req.session.redirect_to;
          req.session.redirect_to = '';
        }
        console.log("Redirect to: " + redirect_to);
        return res.redirect(redirect_to);
      });
    })(req, res, next);
  });

  app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });
  // EACH ACCOUNT
  app.get('/', isLoggedIn, function (req, res) {
    res.render('web/dashboard');

  });


  app.post('/web/get-mesrecent',isLoggedIn,Friend.getMessageRecent);

}
