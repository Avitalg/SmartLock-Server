var mongoose = require('mongoose');
var consts = require('./consts');

mongoose.connect(consts.mongoUrl);
db = mongoose.connection;

db.on('error', function(err){
	console.log('Mongoose: Error: '+ err);
});

db.on('open', function(){
	console.log('Mongoose: Connection established');
});

db.on('disconnected', function(){
	console.log('Mongoose: Connection stopped');
	//mongoose.connect(config.mongoUrl, options);
});

db.on('reconnected', function(){
	console.info('Mongoose reconnected!');
});

