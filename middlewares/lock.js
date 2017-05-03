var Lock = require('../models/lock');
var Message = require('./message');

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

exports.getLock = function(req, res){
	var lockid = req.params.lockid;
	if(!lockid){
		Message.messageRes(req, res, 404, "error", "Lockid wasn't entered");
	}else{
		Lock.findOne({'lockid':lockid}, function(err, lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!lock){
				res.status(404);
				res.json([{"error":"Lock doesn't exist"}]);
				Message.messageRes(req, res, 404, "error", "Lock doesn't exist");
			}else{
				Message.messageRes(req, res, 200, "success", lock);
			}
		});
	}
	return;
};

exports.addLock = function(req,res){
	var lock = req.body.lockid,
		status = req.body.lstatus;

	if(!lock){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else {
		var newlock = new Lock({
			lockid: lock,
			status: status
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

exports.updateLockStatus= function(req,res){
	var lockid = req.params.lockid,
		status = req.params.lstatus;

	if(!lockid){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else {
		Lock.findOne({ "lockid": lockid }, function (err, lock){
			if(!lock){
				Message.messageRes(req, res, 404, "error", "The lock "+lock+" doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				lock.status = status;
				lock.save();
				Message.messageRes(req, res, 200, "success", "succeed update lock.");
			}
		});
	}
	return;
};

