"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var session = require('express-session');
var routes_1 = require("./routes");
var app = express();
exports.app = app;
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 4300));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xshop-shubert', { useMongoClient: true });
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
    require('./seed'); // Seed database with some sample data
    routes_1.default(app);
    app.listen(app.get('port'), function () {
        console.log('AfloCommerce listening on port ' + app.get('port'));
    });
});
//# sourceMappingURL=app.js.map