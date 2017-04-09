var Permission  = require('../models/permission');

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
		frequency = req.params.frequency,
		date = req.params.date,
		start1 = req.params.start1,
		start2 = req.params.start2,
		start3 = req.params.start3,
		start4 = req.params.start4,
		start5 = req.params.start5,
		start6 = req.params.start6,
		start7 = req.params.start7,
		end1   = req.params.end1,
		end2   = req.params.end2,
		end3   = req.params.end3,
		end4   = req.params.end4,
		end5   = req.params.end5,
		end6   = req.params.end6,
		end7   = req.params.end7;

	if(!userid && !lockid){
		res.status(500);
		res.json({"error":"userid and lockid weren't supplied"});
	} else {

		var permission = new Permission({
			userid: userid,
			lockid: lockid,
			frequency: frequency
		});

		switch(frequency) {
			case "always":
				permission.duration = {
					Sunday: {
						start: start1,
						end: end1
					},
					Monday: {
						start: start2,
						end: end2
					},
					Tuesday: {
						start: start3,
						end: end3
					},
					Wednesday: {
						start: start4,
						end: end4
					},
					Thursday: {
						start: start5,
						end: end5
					},
					Friday: {
						start: start6,
						end: end6
					},
					Saturday: {
						start: start7,
						end: end7
					}
				};
				break;
			case "once":
				permission.date = date;

		}




		//if User exist, won't save him.
		Permission.findOneAndUpdate({"userid": userid, "lockid": lockid}, permission, {upsert:true},
			function(err, doc){
				if (err){
					res.status(500);
					res.json({ error: "Permission already exists" });
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
				res.json(err);
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
		frequency = req.params.frequency,
		start1 = req.params.start1,
		start2 = req.params.start2,
		start3 = req.params.start3,
		start4 = req.params.start4,
		start5 = req.params.start5,
		start6 = req.params.start6,
		start7 = req.params.start7,
		end1   = req.params.end1,
		end2   = req.params.end2,
		end3   = req.params.end3,
		end4   = req.params.end4,
		end5   = req.params.end5,
		end6   = req.params.end6,
		end7   = req.params.end7;


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
				res.json(err);
			} else {
				permission.frequency = frequency;
				permission.duration = {
					Sunday : {
						start : start1,
						end	  : end1
					},
					Monday : {
						start : start2,
						end	  : end2
					},
					Tuesday : {
						start : start3,
						end	  : end3
					},
					Wednesday : {
						start : start4,
						end	  : end4
					},
					Thursday : {
						start : start5,
						end	  : end5
					},
					Friday : {
						start : start6,
						end	  : end6
					},
					Saturday : {
						start : start7,
						end	  : end7
					}
				};

				permission.save();
			  	res.status(200);
			  	res.json({"success":"succeed update permission."});
			}
		});
	}
	return;

};

exports.updatePhysicalId = function(req,res){
	var userid = req.params.userid,
		lockid = req.params.lockid,
		physicalId = req.params.physicalId;

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
				permission.save();
				res.status(200);
				res.json({"success":"succeed update permission."});
			}
		});
	}
	return;
};