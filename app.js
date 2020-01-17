var createError = require('http-errors');
var express = require('express');
var path = require('path');
const consolidate = require('consolidate');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const config = require('./config');
const bodyParser = require('busboy-body-parser');
var mustacheExpress = require('mustache-express');

var app = express();
app.engine('mst', mustacheExpress());
app.set('view engine', 'mst');
app.engine('mst', mustacheExpress(path.join(__dirname, 'views/partials')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser());
const servPort = config.ServerPort;

require('./config-passport');
app.use(cookieParser());

app.use(session({
    secret: 'ruslanpostav85',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 30 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const MongoClient = require('mongoose');
const url = config.DatabaseUrl;
const conOptions = { useNewUrlParser: true, useFindAndModify: false };

MongoClient.connect(url, conOptions)
    .then(client => {
        app.listen(servPort, () => console.log(`Listening on port 3001!`));
        console.log(`Successfully connected to database server at ${url}`);
    })
    .catch(err => {
        console.log(err.toString());
    });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var musicRouter = require('./routes/music');
var errorRouter = require('./routes/error');
var plRouter = require('./routes/playlists');
var api = require('./routes/api');


var music = require('./models/music');
var user = require('./models/user');




// view engine setup

app.use(express.static('public'));
app.use(express.static('models'));
app.use(express.static('data'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/music', musicRouter);
app.use('/api', api);
app.use('/error', errorRouter);
app.use('/playlists', plRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.get('/data/fs/:path', function(req, res) {
    res.sendFile(path.join(__dirname, './data/fs/' + req.params.path))
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err.message)
});

module.exports = app;