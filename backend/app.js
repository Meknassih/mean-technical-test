// require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, 'public')));


const apiEndpointPrefix = "/api/v1";
app.use(`${apiEndpointPrefix}/`, indexRouter);
app.use(`${apiEndpointPrefix}/users`, usersRouter);
app.use(`${apiEndpointPrefix}/images`, imagesRouter);

module.exports = app;
