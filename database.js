var mongoose = require('mongoose');
var config={
	prodMongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project',
	qaMongoUrl : 'mongodb://admin:191923@ds159180.mlab.com:59180/final_project-test'
};

var mongoUrl = (process.env.ENV_VAR == 'development') ? config.qaMongoUrl : config.prodMongoUrl;


mongoose.connect(mongoUrl);
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

exports.mongoUrl = mongoUrl;