var express = require('express');
var app = module.exports = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var db = require('./database');

var port = process.env.PORT || (process.argv[2] || 3000);
port = (typeof port === "number") ? port : 3000;

app.set('port', port);
app.use('/', express.static('./public'));
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Header', "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces', 4);
	res.set('Content-Type', "application/json");
	next();
});

require('./routes/lock')(app);
require('./routes/permission')(app);
require('./routes/user')(app);
require('./routes/message')(app);


<<<<<<< HEAD
if(!module.parent){
	app.listen(port);
}
=======

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PERMISSION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getPermissions', permissions.getPermissions);
app.get('/api/getPermission/:userid/:lockid', permissions.getPermission);
app.get('/api/addPermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7', permissions.addPermission);
app.get('/api/removePermission/:userid/:lockid/', permissions.removePermission);
app.get('/api/updatePermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
app.get('/api/updatePhysicalId/:userid/:lockid/:physicalId', permissions.updatePhysicalId);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~USER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getUsers', users.getUsers);
app.get('/api/getUser/:userid', users.getUser);
app.post('/api/addUser', users.addUser);
app.get('/api/removeUser/:userid', users.removeUser);
app.get('/api/updateUser/:userid/:username/:phone/:password', users.updateUser);

app.all('/api/*', users.errorMessage);
app.all('/*', users.errorMessageAll);


app.listen(port);
>>>>>>> 264eb8f89cba97512224169ae390bae4f5ef1d02

console.log('The server is running on port '+ port);