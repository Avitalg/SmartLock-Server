var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
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
  secret: 'foo',
  rolling: true,
  saveUninitialized: false,
  resave: true,
   cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 30 * 30000
   },
   store: new MongoStore({url : db.mongoUrl})
}));


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