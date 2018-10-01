const express = require('express');
const bodyParser = require('body-parser');
var session = require("express-session");
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require("connect-mongo")(session);
const flash = require('connect-flash');
const validator = require('express-validator');
const path = require('path');
require('./passport/passport-local');
require("./passport/passport-facebook");
require('./passport/passport-google');


// const publicPath = path.join(__dirname, "/validation");
//Router
const router = require('./router/router');

// //Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ChatApp');

var app = express();

app.use((req, res, next) => {
    res.locals.userId = req.user;
    next();
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
// app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(validator());
app.use(session({
    secret: "itsasecretkey",
    resave: false,
    saveInitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());
// for dynamic logout
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})
app.use(flash());
app.use(router);



app.listen(3000, (err, res) => {
    if (err) {
        console.log("Some error is occur");
    } else {
        console.log("Server is on Port 3000");
    }
})