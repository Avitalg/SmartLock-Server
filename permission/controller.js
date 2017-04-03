var Permission=require('./schema');
var path = require("path");

exports.getPermissions = function(req,res){
	Permission.find({},
	function(err,permissionRes){
		if(err){
			res.status(500);
			res.json({"error":err});
		}else{	
			res.status(200);
			res.json(permissionRes);
		}
	});
	return;
};

exports.getPermission = function(req,res){
	var userid= req.params.userid,
		lockid = req.params.lockid;

	if(!userid && !lockid){
		res.status(404);
		res.json({"error":"Details weren't supplied"});
	}else{
		Permission.findOne({"userid":userid, "lockid":lockid}, function(err,perResult){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else if(!perResult){
				res.status(404);
				res.json({"error":"Permission doesn't exist"});
			}else{	
				res.status(200);
				res.json(perResult);
			}
		});
	}
	return;
};

exports.addPermission = function(req,res){
	var userid = req.params.userid,
		lockid = req.params.lockid,
		physicalId = req.params.physicalId,
		frequency = req.params.frequency,
		duration1 = req.params.duration1,
		duration2 = req.params.duration2,
		duration3 = req.params.duration3,
		duration4 = req.params.duration4,
		duration5 = req.params.duration5,
		duration6 = req.params.duration6,
		duration7 = req.params.duration7;

	if(!userid && !lockid){
		res.status(500);
		res.json({"error":"userid and lockid weren't supplied"});
	} else {
		var permission = new Permission({
			userid: userid,
			lockid: lockid,
			physicalId: physicalId,
			frequency: frequency,
			duration: [duration1, duration2, duration3, duration4, duration5, duration6, duration7]
		});

		//if User exist, won't save him.
		Permission.findOneAndUpdate({"userid": userid, "lockid": lockid}, permission, {upsert:true},
			function(err, doc){
				if (err){
					res.status(500);
					res.json({ error: err });
				}else{
					res.status(200);
					res.json({"success":"Permission was saved"});
				}
			});
	}
	return;

};

exports.removePermission = function(req,res){
	var userid = req.params.userid,
		lockid = req.params.lockid;
	if(!userid && !lockid){
		res.status(404);
		res.json({"error":"userid and lockid weren't supplied"});
	}else{
		Permission.remove({"userid": userid, "lockid": lockid}, function(err,permission){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else{	
				res.status(200);
				res.json({"success":"Permission was deleted successfully"});
			}
		});
	}
	return;
};



exports.updatePermission = function(req,res){
	var userid = req.params.userid,
		lockid = req.params.lockid,
		physicalId = req.params.physicalId,
		frequency = req.params.frequency,
		duration1 = req.params.duration1,
		duration2 = req.params.duration2,
		duration3 = req.params.duration3,
		duration4 = req.params.duration4,
		duration5 = req.params.duration5,
		duration6 = req.params.duration6,
		duration7 = req.params.duration7;


	if(!userid && !lockid){
		res.status(500);
		res.json({"error":"userid and lockid weren't supplied"});
	} else {
		Permission.findOne({ "userid":userid, "lockid":lockid }, function (err, permission){
			if(!permission){
				res.status(404);
				res.json({error: "Permission doesn't exist"});
			}else if(err){
				res.status(500);
				res.json({error:err});
			} else {
				permission.physicalId = physicalId;
				permission.frequency = frequency;
				permission.duration = [duration1, duration2, duration3, duration4, duration5, duration6, duration7];

				permission.save();
			  	res.status(200);
			  	res.json({"success":"succeed update permission."});
			}
		});
	}
	return;

};
