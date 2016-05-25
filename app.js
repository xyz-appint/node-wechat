var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var wechat = require('./routes/wechat');

var app = express();


// view engine setup
// app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));         // set the static files location
app.use(express.static(__dirname + '/html'));         // set the static files location


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  type: function(req) {
    return /x-www-form-urlencoded/.test(req.headers['content-type']);
  },
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser()).use(session({
  secret: 'mZX30h40nWC6FAZGBN5bk5wI2L2X2VSnpVPO9bA9wEXYP7Mu9iKtfp7M5WfG0Am0nywt3YS1Emc4e3UmiUbOHl3PSurYWQWB5jrcbm564x6duD8OJRY6U9tvaJHRUZqq',
  resave: true,
  saveUninitialized:true,
  cookie: {  maxAge: 30 * 60 * 1000 }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/wechat', wechat);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
