/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: app.js
 *
 * Description: This file stores all the necessary libraries, routers and
 * unmounted middleware (needs next() to be called or it'll hang) for our
 * application.
 **************************************************************/
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var handlebars = require("express-handlebars");
var sessions = require("express-session");
var mysqlSession = require("express-mysql-session")(sessions);
var flash = require("express-flash");
var multer = require("multer");
var cors = require("cors");
/**
 * We are keeping MVC design pattern in mind to organize and divide the related program logic.
 */

var app = express();

app.use(cors({ origin: true }));

// set each route
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var aboutRouter = require("./routes/about");
var postRouter = require("./routes/post");


var requestPrint = require("./helpers/debug/debugprinters").requestPrint;

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: {
      emptyObject: (obj) => {
        return !(obj.constructor === Object && Object.keys(obj).length == 0);
      },
    },
  })
);
app.use("/terms",function(request,response,next)
{
  response.render("termsAndPrivacy");

});

// https://www.npmjs.com/package/express-mysql-session
// session store will create a connection pool which will handle the connection
// to the database. With the default options, a session table will be automatically generated
// for us.
var mysqlSessionStore = new mysqlSession(
  {
    // as we're going to use default options
  },
  require("./conf/database")
);

app.use(
  sessions({
    // key will give a default value of connect.sid but we want to a little more control thus
    key: "this is my special key",
    secret: "shhh_its_a_secret.",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);
app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// path to static content
app.use(express.static(path.join(__dirname, "public")));

// these are not self-terminating middlewares thus you must call next()
app.use((req, res, next) => {
  requestPrint(req.url);
  next();
});

/**
 * request.save
 * wrap res.redirect() with req.session.save(function(err){ res.direct()})
 * */
app.use((req, res, next) => {
  // console.log(req.session);
  if (req.session.username) {
    // console.log(req.session);
    res.locals.logged = true;
  }
  next();
});


app.use(function (request, response, next)
{
  response.locals.usertype = (request.session.usertype==0);
  next();
});





// renders index.hbs
app.use("/", indexRouter);
// renders users.hbs
app.use("/users", usersRouter);
// renders about.hbs
app.use("/about", aboutRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// this line is necessary such that the www in the ./bin/www runs our server
module.exports = app;
