const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

let indexRouter = require('./routes/index');
let weatherRouter = require('./routes/weather');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/weather', weatherRouter);

if (!fs.existsSync('./cache')){
    fs.mkdirSync('./cache');
}

module.exports = app;