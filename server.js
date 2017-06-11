// 'npm run dev' to trigger nodemon server.js

// https://github.com/braitsch/node-login

// https://zellwk.com/blog/crud-express-mongodb/
// http://blog.soshace.com/ru/2016/11/24/node-lessons-express-foundation-pt2/
// http://blog.rukomoynikov.ru/avtorizatsiya-polzovatelej-express-js-mongo/
// ? https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/

const express = require('express');
const bodyParser = require('body-parser'); // reading data from the <form> element
const cookieParser = require('cookie-parser');
const session = require('express-session');
const favicon = require('serve-favicon');

const app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(cookieParser('cookiesecret'));
app.use(bodyParser.urlencoded({extended: true})); // method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object

app.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }
    next();
});

app.use(express.static(__dirname + '/public'));

app.use(session({
  resave: true, // false=don't save session if unmodified
  //path: '/',
  saveUninitialized: true, // false=don't create session until something stored
  secret: 'sessionsecret'
  // cookie: { maxAge: 60000 }
}));

require('./router/router')(app);

app.listen(8888, () => {
	console.log("Server: localhost, port 8888");
});


// v1 : server + routing + templates + public folder
// v2 : + keeping cookie data
// v3: + sessions