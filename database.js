var mongoose = require('mongoose');
config={
	mongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project'
};


mongoose.connect(config.mongoUrl);
db = mongoose.connection;

db.on('error', function(err){
	console.log('Mongoose: Error: '+ err);
});

db.on('open', function(){
	console.log('Mongoose: Connection established');
});

db.on('disconnected', function(){
	console.log('Mongoose: Connection stopped, recconect');
	//mongoose.connect(config.mongoUrl, options);
});

db.on('reconnected', function(){
	console.info('Mongoose reconnected!');
});
