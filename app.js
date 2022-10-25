var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
const passport = require('passport');
require('./passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
// var routes = require('./routes/index')(passport);

// database
const mongoDb = process.env.DATA_BASE_KEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comments");
const pictureRouter = require("./routes/picture");

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', postRouter);
app.use('/blog', commentRouter);
app.use('/blog', pictureRouter);

// app.use('/blog', passport.authenticate('jwt', {session: false}), postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
