const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts')
const authRouter = require('./routes/auth')
const commentsRouter = require('./routes/comments')
const collectionsRouter = require('./routes/collections')

const dotenv = require('dotenv')
dotenv.config()


const app = express();

const mongoose = require('mongoose')
const {DB_HOST, SECRET_KEY} = process.env

mongoose.connect(DB_HOST).then(() => {
    console.log('Database  connected')
}).catch((error) => {
    console.log(error.message)
    process.exit(1)
})

const cors = require('cors')

app.use(logger('dev'));
app.use(cors())
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/collections', collectionsRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, 'Route no exists'));
});

// error handler
app.use((err, req, res, next) => {
    const {statusCode = 500, statusMessage = 'error', message = 'Server error'} = err
    console.log(err, 'error handler')

    res.status(statusCode).json({
        message: statusCode === 500 ? 'Server error' : message,
        code: statusCode,
        status: statusMessage
    })
});

module.exports = app

