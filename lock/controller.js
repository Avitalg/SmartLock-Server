var Lock = require('./schema');

exports.getLocks = function(req,res){
	Lock.find({},
	function(err,lockRes){
		if(err){
			res.status(500);
			res.json({"error":err});
		}else{
			res.status(200);
			res.json(lockRes);
		}
		return;
	});
};

exports.getLock = function(req, res){
	var lockid = req.params.lockid;
	if(!lockid){
		res.status(404);
		res.json({"error":"Lockid wasn't entered"});
	}else{
		Lock.findOne({'lockid':lockid}, function(err, lock){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else if(!lock){
				res.status(404);
				res.json([{"error":"Lock doesn't exist"}]);
			}else{
				res.status(200);
				res.json(lock);
			}
		});
	}
	return;
};

exports.addLock = function(req,res){
	var lock = req.params.lockid,
		status = req.params.lstatus;

	if(!lock){
		res.status(500);
		res.json({"error":"No lock name was entered"});
	} else {
		var newlock = new Lock({
			lockid: lock,
			status: status
		});

		//if look exist, won't save him.
		Lock.findOneAndUpdate({'lockid': lock}, newlock, {upsert:true},
			function(err, doc){
				if (err){
					res.status(500);
					res.json({ error: err });
				}else{
					res.status(200);
					res.json({"success":"Lock was saved"});
				}
			});
	}
	return;
};

exports.removeLock = function(req,res){
	var lock= req.params.lockid;
	if(!lock){
		res.status(404);
		res.json({"error":"Lock name wasn't supplied"});
	}else{	
		Lock.remove({"lockid":lock}, function(err,lock){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else{	
				res.status(200);
				console.log("err:"+err+", lock:"+lock);
				res.json({"success":"Lock was removed successfully"});
			}
		});
	}
	return;
};


exports.updateLockStatus= function(req,res){
	var lockid = req.params.lockid,
		status = req.params.lstatus;

	if(!lockid){
		res.status(500);
		res.json({"error":"No lockid was entered"});
	} else {
		Lock.findOne({ "lockid": lockid }, function (err, lock){
			if(!lock){
				res.status(404);
				res.json({error: "The lock "+lock+" doesn't exist"});
			}else if(err){
				res.status(500);
				res.json({error:err});
			} else {
				lock.status = status;
				lock.save();
				res.status(200);
				res.json({"success":"succeed update lock."});
			}
		});
	}
	return;
};
