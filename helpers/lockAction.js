var pysicId = require("./physicalId");
var valid = require('./validation');
var Lock  = require('../middlewares/lock');

exports.lockActionControl = function(req, res, next){
	var action = req.params.action;

	if(!valid.checkLockAction(action)){
        console.log("action");
        Message.messageRes(req, res, 404, "error", "undefine action");
        return;
    }

    console.log("action:"+action);

    req.params.lockid = req.body.lockid;

	switch(action){
		case "addFingerprint": case "delFingerprint":
			pysicId.fingerprintActions(req, res, next);
			break;
		case "unlock": 
			req.params.lstatus = "open";
			Lock.updateLockStatus(req, res, next);
			break;
		case "lock": 
			req.params.lstatus = "close";
			Lock.updateLockStatus(req, res, next);
			break;
		case "checkStatus":
			next();
	}

}