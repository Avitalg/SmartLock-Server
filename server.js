var express = require('express');
//var session = require('express-session');
const session = require("client-sessions");
var app = express();
var bodyParser = require('body-parser');
//var MongoStore = require('connect-mongo')(clientSessions);
var cors = require('cors');
var livereload  = require("connect-livereload");


process.env.ENV_VAR = process.env.ENV_VAR || "development";

var db = require('./database');

var port = process.env.PORT || 3000;

// var whiteListDomains = ["https://smartlockproj.com", "http://127.0.0.1:8000"];

app.set('port', port);

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
    cookieName: 'mySession', // cookie name dictates the key name added to the request object
    secret: 'blargadeeblargblarg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if exp

  //rolling: true,
  //saveUninitialized: false,
  //resave: true,
  // cookie: {
  //    httpOnly: false,
  //    secure: false,
  //    maxAge: 24*60*60*1000 //one hour
  // },
  // store: new MongoStore({url : db.mongoUrl})
}));

app.use(function(req, res, next) {
    if (req.mySession.seenyou) {
        res.setHeader('X-Seen-You', 'true');
    } else {
        // setting a property will automatically cause a Set-Cookie response
        // to be sent
        req.mySession.seenyou = true;
        res.setHeader('X-Seen-You', 'false');
    }
});


app.use(livereload());


app.use('/', express.static('./public'));
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin', "https://smartlockproj.com");
	res.header('Access-Control-Allow-Header', "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces', 4);
	res.set('Content-Type', "application/json");
	next();
});

require('./routes/lockRequest')(app);
require('./routes/lock')(app);
require('./routes/permission')(app);
require('./routes/user')(app);
require('./routes/message')(app);

app.listen(port);

console.log('The server is running on port '+ port);