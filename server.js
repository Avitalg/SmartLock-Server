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


if(!module.parent){
	app.listen(port);
}

console.log('The server is running on port '+ port);