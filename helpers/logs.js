var fs = require('fs');
var Message = require('../middlewares/message');

exports.writeLog = function(req, res){
	var filename = "logs.json",
		  username = req.body.username,
      lockid = req.body.lockid;
      action = req.params.action,
      physicId = req.physicId;

    var logs = JSON.parse(fs.readFileSync(filename, 'utf8'));

    var jsonLog = {
    	"username": username,
   		"lockid": lockid,
   		"action": action,
   		"time": new Date()
   	};

   	if(action.indexOf('Fingerprint')>-1){
   		jsonLog.physicId = physicId;
   	}

    logs.push(jsonLog);

    fs.writeFile(filename, JSON.stringify(logs), 'utf8');

    console.log(logs);

};

exports.getLogs = function(){
	var filename = "logs.json";
    return JSON.parse(fs.readFileSync(filename, 'utf8'));

};
