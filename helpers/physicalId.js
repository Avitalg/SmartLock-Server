var Permission  = require('../models/permission');
var Message = require('../middlewares/message');
var permission  = require('../middlewares/permission');

var _this = this;

/**
gets array of pysical ids exist in db
returns minimum value available between 0 and 162.
if no value avilable - returns -1
**/
var findMinimumPhysId = function(pIds){

	for(var i =0; i<163; i++){
		if(pIds.indexOf(i.toString())==-1){
			return i;
		}
	}
	return -1;
};


/**
Routes the right fingerprint action to the right function
**/
exports.fingerprintActions = function(req, res, next){
	var fPrint = req.params.action;

	//could be in param or from body. need to save for the next callback
	if(!req.params.lockid){
		req.params.lockid = req.body.lockid ;
	}
	if(!req.params.username){
		req.params.username = req.body.username ;
	}

	switch(fPrint){
		case "addFingerprint":
			permission.getPhysicalId(req, res, next);
			break;
		case "delFingerprint":
			permission.removePhysicalId(req, res, next);
			break;

	}
}
