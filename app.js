var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');
var expressValidator = require('express-validator');
var connectDomain = require('connect-domain');

//changes in burhan
//changes in development

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');


var home = require('./routes/home');

var app = express();
app.use(cors());
app.use(connectDomain());

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

// mongoose.set('debug',true);

/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(multer({
    dest: path.join(__dirname, 'uploads')
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(methodOverride());

global.appRoot = path.resolve(__dirname);


/* open access routes */
app.use('/', home);




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
        res.json({
            message: err.message,
            error: err,
            stack: err.stack
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
