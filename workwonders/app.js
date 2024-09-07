var createError = require('http-errors');
const serverless = require('serverless-http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

// Set up mongoose connection
require('dotenv').config()


const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 50000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected successfully'))

    .catch(err => console.error('MongoDB connection error:', err));
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

var app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST'
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: res.locals.message,
    // Optionally include stack trace only in development
    ...(req.app.get('env') === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
// module.exports.handler = serverless(app);