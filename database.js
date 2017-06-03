var mongoose = require('mongoose');
var config={
	prodMongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project',
	qaMongoUrl : 'mongodb://admin:191923@ds159180.mlab.com:59180/final_project-test'
};

var mongoUurl = (process.env.ENV_VAR == 'qa') ? config.qaMongoUrl : config.prodMongoUrl;


mongoose.connect(mongoUurl);
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
