var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var db = require('./database');
var permissions = require('./permission/controller');
var users = require('./user/controller');
var locks = require('./lock/controller');

var port = process.env.PORT || 3000;

app.set('port', port);
app.use('/', express.static('./public'));
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Header', "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces', 4);
	res.set('Content-Type', "application/json");
	next();
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOCK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getLocks', locks.getLocks);
app.get('/api/getLock/:lockid', locks.getLock);
app.get('/api/addLock/:lockid/:lstatus', locks.addLock);
app.get('/api/removeLock/:lockid', locks.removeLock);
app.get('/api/updateLockStatus/:lockid/:lstatus', locks.updateLockStatus);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PERMISSION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getPermissions', permissions.getPermissions);
app.get('/api/getPermission/:userid/:lockid', permissions.getPermission);
app.get('/api/addPermission/:userid/:lockid/:frequency/:duration1/:duration2/:duration3/:duration4/:duration5/:duration6/:duration7', permissions.addPermission);
app.get('/api/removePermission/:userid/:lockid/', permissions.removePermission);
app.get('/api/updatePermission/:userid/:lockid/:frequency/:duration1/:duration2/:duration3/:duration4/:duration5/:duration6/:duration7', permissions.updatePermission);
app.get('/api/updatePhysicalId/:userid/:lockid/:physicalId', permissions.updatePhysicalId);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~USER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getUsers', users.getUsers);
app.get('/api/getUser/:userid', users.getUser);
app.get('/api/addUser/:userid/:username/:phone/:password', users.addUser);
app.get('/api/removeUser/:userid', users.removeUser);
app.get('/api/updateUser/:userid/:username/:phone/:password', users.updateUser);

app.all('/api/*', users.errorMessage);
app.all('/*', users.errorMessageAll);


app.listen(port);

console.log('The server is running on port '+ port);