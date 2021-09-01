var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');
var multer = require('multer');

// set each route 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');

var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "layout",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0)
            }
        },
    })
  );

  // node module express-mysql-session
// https://www.npmjs.com/package/express-mysql-session
// session store will create a connection pool which will handle the connection
// to the database. With the default options, a session table will be automatically generated 
// for us. 
var mysqlSessionStore = new mysqlSession(
    {
      // as we're going to use default options
    },
    require('./conf/database')  
  );
  
  app.use(sessions({
    // key will give a default value of connect.sid but we want to a little more control thus 
    key: "csid",
    secret: "shhh it's a secret.",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  // path to static content
  app.use(express.static(path.join(__dirname, 'public')));
  
  
  // used for helper functions
  // these are not self-terminating middlewares thus you must call next()
  app.use((req, res, next) => {
    requestPrint(req.url);
    next();
  });
  
  app.use((req, res, next) => {
    if(req.session.username){
      res.locals.logged = true;
    }
    next();
  })
  
  
  // renders index.hbs
  app.use('/', indexRouter);
  // renders users.hbs
  app.use('/users', usersRouter);
  // renders about.hbs
  app.use('/about', aboutRouter);
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  // this line is necessary such that the www in the ./bin/www runs our server
  module.exports = app;
  