var Permission  = require('../models/permission');
var Message = require('../middlewares/message');
var permission  = require('../middlewares/permission');

var _this = this;

exports.getPhysicalId = function(req, res, next){
	var lockid = req.params.lockid;
	
	var physicalId = [];
	var physicValue;

	Permission.find({"lockid":lockid}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){
			Message.messageRes(req, res, 404, "error", "Lock doesn't exist");
		}else{
			if(perResult.length>0){
				for(var i=0; i<perResult.length; i++){
					if(!!perResult[i].physicalId){
						physicalId.push(perResult[i].physicalId);
					}
				}
			} else { // only one permission found
				physicalId.push(perResult.physicalId);
			}
			physicValue = findMinimumPhysId(physicalId);
			req.physicId = physicValue;

			permission.updatePhysicalId(req,res,next);
		}
	});
	return;

};

//returns minimum value available between 0 and 162
var findMinimumPhysId = function(pIds){

	for(var i =0; i<163; i++){
		if(pIds.indexOf(i.toString())==-1){
			return i;
		}
	}
	return -1;
};

exports.fingerprintActions = function(req, res, next){
	var fPrint = req.params.action;

	//could be in param or from body. need to save for the next callback
	if(!req.params.lockid){
		req.params.lockid = req.body.lockid ;
	}
	if(!req.params.username){
		req.params.username = req.body.username ;
	}
	console.log(fPrint);

	switch(fPrint){
		case "addFingerprint":
			_this.getPhysicalId(req, res, next);
			break;
		case "delFingerprint":
			permission.removePhysicalId(req, res, next);
			break;

	}
}
