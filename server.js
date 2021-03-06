var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan      = require('morgan');
var auth = require('./helpers/auth');
var permissions = require('./middlewares/permission');
var users = require('./middlewares/user');
var lockRequest = require('./middlewares/lockRequest');

var db = require('./database');
var consts = require('./config/main');
// var whiteListDomains = ["https://smartlockproj.com", "http://127.0.0.1:8000"];


app.set('port', consts.port);

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', express.static('./public'));
app.use(function(req, res, next){
	var headerOrigin = (process.env.ENV_VAR == 'development') ? "http://localhost:8887" : req.headers.origin;
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin',  req.headers.origin);
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	app.set('json spaces', 4);
	res.set('Content-Type', "application/json");
	next();
});



/******************
ROUTES WITHOUT AUTH
*******************/
/**USER REQUEST**/
app.post('/api/login', users.login);
app.put('/api/forgotPassword/:username', users.forgotPassword, permissions.sendEmail);
app.post('/api/contactUs', permissions.contactUs, permissions.sendEmail);
app.post('/api/addUser', users.addUser, permissions.sendEmail);
app.post('/api/openManagerAccount', permissions.checkIfHasManager, permissions.addManagerPermission, users.addUser,  permissions.sendEmail);
app.post('/api/validationCode', users.checkValidCode);
app.post('/api/sendValidCode', users.sendValidCode, permissions.sendEmail);
/**LOCK REQUEST**/
app.get('/api/lockRequest/:lockId',lockRequest.checkLockRequest);
app.post('/api/lockRequest/:lockId',lockRequest.updateLockRequest);
app.post('/api/localButtonAction/:lockid',lockRequest.updateLocalButtonAction);

app.use(auth.verifyToken);

/**************
****ROUTES*****
***************/
require('./routes/lockRequest')(app);
require('./routes/lock')(app);
require('./routes/permission')(app);
require('./routes/user')(app);
require('./routes/logs')(app);
require('./routes/message')(app);

/********************
****START SERVER*****
*********************/
app.listen(consts.port);

console.log('The server is running on port '+ consts.port);