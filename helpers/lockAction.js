var pysicId = require("./physicalId");
var valid 	= require('./validation');
var Lock  	= require('../middlewares/lock');

/**
check  the action that was created by user and transfer it to the right function.
**/
exports.lockActionControl = function(req, res, next){
	var action = req.params.action;

	if(!valid.checkLockAction(action)){
        console.log("action");
        Message.messageRes(req, res, 404, "error", "undefine action");
    }
    
    req.params.lockid = req.body.lockid;

	switch(action){
		case "addFingerprint": case "delFingerprint": 	//finger-print actions 
			pysicId.fingerprintActions(req, res, next);
			break;
		case "unlock": 									//lock action - unlock
			req.params.lstatus = "open";
			Lock.updateLockStatus(req, res, next);
			break;
		case "lock": 									//lock action - lock
			req.params.lstatus = "close";
			Lock.updateLockStatus(req, res, next);
			break;
		case "checkStatus": 							//lock action - check lock status
			next();
	}

}