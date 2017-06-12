const express = require('express');
const bodyParser = require('body-parser'); // reading data from the <form> element
const cookieParser = require('cookie-parser');
const session = require('express-session');
const favicon = require('serve-favicon');

const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(cookieParser('cookiesecret'));
app.use(bodyParser.urlencoded({extended: true}));

app.use( function( req, res, next ) {
    if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

app.use(express.static(__dirname + '/public'));

app.use(session({
  resave: true,
  //path: '/',
  saveUninitialized: true,
  secret: 'sessionsecret'
  // cookie: { maxAge: 60000 }
}));

require('./router/router')(app);

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

