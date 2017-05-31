var Permission  = require('../models/permission');
var Message = require('../middlewares/message');

exports.getPhysicalId = function(req, res, next){
	var lockid;
	
	var physicalId = [];
	var physicValue;

	//could be in param or from body. need to save for the next callback
	if(req.params.lockid){
		lockid = req.params.lockid;
	}else{
		lockid = req.params.lockid = req.body.lockid ;
		req.params.username = req.body.username ;
	}

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

			if(typeof(next) == "function"){
				next();
			}
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