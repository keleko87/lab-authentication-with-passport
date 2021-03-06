var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var index = require('./routes/index');
var users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");

//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");
//require the user model
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");


//enable sessions here
app.use(session({
  secret: "klsjdfhglkjhsdlkf",
  resave: true,
  saveUninitialized: true
}));


//initialize passport and session here
// var passport = require("./passport/local")();  // Lo que devuelve el require es una funcion por lo que con () la ejecutamos en este momento
const passport = require("passport");
require('./passport/local');  // Esto devuelve una funcion que ejecutamos en este instante.
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// require in the routers
app.use('/', index);
app.use('/auth', passportRouter);


//passport code here


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
