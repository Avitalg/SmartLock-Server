process.env.ENV_VAR = process.env.ENV_VAR || "development";
var port = process.env.PORT || 3000;

var config={
	prodMongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project',
	devMongoUrl : 'mongodb://admin:191923@ds159180.mlab.com:59180/final_project-test'
};

var mongoUrl = (process.env.ENV_VAR == 'development') ? config.devMongoUrl : config.prodMongoUrl;
var headerOrigin = (process.env.ENV_VAR == 'development') ? "*" : "https://smartlockproj.com";
var domain = (process.env.ENV_VAR == 'development') ? "" : "smartlockproj.com";

exports.mongoUrl = mongoUrl;
exports.port = port;
exports.headerOrigin = headerOrigin;
exports.domain = domain;