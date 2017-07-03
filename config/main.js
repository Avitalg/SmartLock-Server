process.env.ENV_VAR = process.env.ENV_VAR || "development";
var port = process.env.PORT || 3000;

var config={
	prodMongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project',
	devMongoUrl : 'mongodb://admin:191923@ds159180.mlab.com:59180/final_project-test'
};

var mongoUrl = (process.env.ENV_VAR == 'development') ? config.devMongoUrl : config.prodMongoUrl;
var domain = (process.env.ENV_VAR == 'development') ? "" : "smartlockproj.com";


module.exports ={
	"mongoUrl" : mongoUrl,
	"port" : port,
	"domain" : domain,
	"EMAIL_USER": process.env.EMAIL_USER || "x",
	"EMAIL_PASS": process.env.EMAIL_PASS || "x",
	'secret': process.env.SECRET || 'ilovescotchyscotch',
	'accountSid': process.env.TWILIO_ACCOUNT_SID ||"ACc3804d4663cce05e00467e7c0c408283",
	'authToken': process.env.TWILIO_AUTH_TOKEN || "bed801907e7f12034b96540742b8e7e6",
	'authyKey': process.env.AUTHY_TOKEN
};
