var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const Sequlize = require('sequelize');
const { sequelize } = require('./models/index');
sequelize.authenticate()
  .then(() => {
    console.log('connected to DB');
  });
sequelize.sync();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Catch 404
app.use(function(req, res, next) {
  const err = new Error('Page Not Found');
  err.status = 404;
  console.log(`Error: ${err.status}, Message: ${err.message}, Stack: ${err.stack}`);
  next(err);
});

//Handle error
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message, err.status);
  res.status(err.status || 500);
  if (err.status === 404) 
    res.render('page-not-found');
  else res.render('error');
});

module.exports = app;

let port = 3000;
app.listen(port, () => {
  console.log(`The application is running on localhost:${port}`);
});