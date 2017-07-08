var Lock = require('../models/lock');
var Message = require('./message');
var Permission = require('../models/permission');
var valid = require('../helpers/validation');


/**
returns all locks
**/
exports.getLocks = function(req,res){
	Lock.find({},
	function(err,lockRes){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else{
			Message.messageRes(req, res, 200, "success", lockRes);
		}
		return;
	});
};


/**
get specific lock
**/
exports.getLock = function(req, res, next){
	var lockid = (req.params.lockid) ? req.params.lockid : req.body.lockid;

	if(!lockid){
		Message.messageRes(req, res, 200, "error", "Lockid wasn't entered");
	}else{
		Lock.findOne({'lockid':lockid}, function(err, lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!lock){
				Message.messageRes(req, res, 200, "error", "Lock doesn't exist");
			}else{
				if(req.route.stack.length > 1){
					next();
					return;
				}
				Message.messageRes(req, res, 200, "success", lock);
			}
		});
	}
	return;
};


/*
Gets list of lockid and returns locks' details
*/
exports.getLocksById = function(req, res){
	var locks = req.lockids;

	if(!locks){
		Message.messageRes(req, res, 200, "error", "User doesn't have locks to manage.");
	}else{
		Lock.find({'lockid':{$in:locks}}, function(err, lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!lock){
				Message.messageRes(req, res, 200, "error", "User doesn't have locks to manage.");
			}else{
				Message.messageRes(req, res, 200, "success", lock);
			}
		});
	}
	return;
};


/**
get all user's locks
**/
exports.getLocksByUser = function(req, res){
	var username = req.user.username;

	if(!username){
		Message.messageRes(req, res, 404, "error", "username wasn't entered");
	}else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username with Invalid email");
	}else{
		//get user permissions
		Permission.findOne({'username':username}, function(err, perRes){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perRes){// no permission was found
				Message.messageRes(req, res, 404, "error", "username doesn't have permissions");
			}else{
				var locks = [];
				// get all locks ids
				if(!perRes.length){ //if an object - just go the the only lockid he has
					locks.push(perRes.lockid);
				} else { // if array - go over all permissions
					for(var i=0; i<perRes.length; i++){
						locks.push(perRes[i].lockid);
					}	
				}
				//get all locks
				Lock.find({"lockid":{$in:locks}},function(err,data){
					if(err){
						Message.messageRes(req, res, 500, "error", err);
					}else{
						Message.messageRes(req, res, 200, "success", {"userLocks":data});

					}
					
				})
			}
		});
	}
	return;


};

/**
add new lock
**/
exports.addLock = function(req,res){
	var lock = req.body.lockid,
		desc = req.body.desc,
		status = req.body.lstatus;

	if(!lock){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else if(!valid.checkStatus(status)) {
		Message.messageRes(req, res, 500, "error", "Wrong lock status");
	}else{
		var newlock = new Lock({
			lockid: lock,
			status: status,
			description: desc
		});

		//if look exist, won't save him.
		Lock.findOneAndUpdate({'lockid': lock}, newlock, {upsert:true},
			function(err, doc){
				if (err){
					Message.messageRes(req, res, 500, "error", err);
				}else{
					Message.messageRes(req, res, 200, "success", "Lock "+lock+" was saved");
				}
			});
	}
	return;
};


/**
delete lock
**/
exports.removeLock = function(req,res){
	var lock= req.params.lockid;
	if(!lock){
		Message.messageRes(req, res, 404, "error", "Lock name wasn't supplied");
	}else{	
		Lock.remove({"lockid":lock}, function(err,lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				Message.messageRes(req, res, 200, "success", "Lock "+lock+" was removed successfully");

			}
		});
	}
	return;
};

/**
update lock status - open/close
**/
exports.updateLockStatus= function(req,res, next){
	var lockid = (req.params.lockid) ? req.params.lockid:req.body.lockid,
		status = req.params.lstatus;

	if(!lockid){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else if(!valid.checkStatus(status)) {
		Message.messageRes(req, res, 500, "error", "Wrong lock status");
	} else {
		Lock.findOne({ "lockid": lockid }, function (err, lock){
			if(!lock){
				Message.messageRes(req, res, 404, "error", "The lock "+lockid+" doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				lock.status = status;
				lock.save();
				if(req.route.stack.length > 1){
					next();
				}else {
					Message.messageRes(req, res, 200, "success", "succeed update lock.");					
				}
			}
		});
	}
	return;
};

