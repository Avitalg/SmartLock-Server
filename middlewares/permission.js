var Permission  = require('../models/permission');

exports.getPermissions = function(req,res){
	Permission.find({},
	function(err,permissionRes){
		if(err){
			res.status(500);
			res.json({"status":"error","message":err});
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
		res.json({"status":"error","message":"Details weren't supplied"});
	}else{
		Permission.findOne({"userid":userid, "lockid":lockid}, function(err,perResult){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else if(!perResult){
				res.status(404);
				res.json({"status":"error","message":"Permission doesn't exist"});
			}else{	
				res.status(200);
				res.json(perResult);
			}
		});
	}
	return;
};

exports.addPermission = function(req,res){
	var userid = req.body.userid,
		lockid = req.body.lockid,
		frequency = req.body.frequency,
		date = req.body.date,
		start1 = req.body.start1,
		start2 = req.body.start2,
		start3 = req.body.start3,
		start4 = req.body.start4,
		start5 = req.body.start5,
		start6 = req.body.start6,
		start7 = req.body.start7,
		end1   = req.body.end1,
		end2   = req.body.end2,
		end3   = req.body.end3,
		end4   = req.body.end4,
		end5   = req.body.end5,
		end6   = req.body.end6,
		end7   = req.body.end7;

	if(!userid && !lockid){
		res.status(500);
		res.json({"status":"error","message":"userid and lockid weren't supplied"});
	} else {

		var permission = new Permission({
			userid: userid,
			lockid: lockid,
			frequency: frequency
		});

		switch(frequency) {
			case "always":
				console.log("always.");
				console.log(frequency);
				delete permission.date;
				delete permission.hours;
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
				delete permission.duration;
				permission.date = new Date(date).toLocaleString() ;
				permission.hours = {
					start : start1,
					end : end1
				}

		}




		//if User exist, won't save him.
		Permission.findOneAndUpdate({"userid": userid, "lockid": lockid}, permission, {upsert:true},
			function(err, doc){
				if (err){
					res.status(500);
					res.json({ "status":"error","message": "Permission already exists" });
				}else{
					res.status(200);
					res.json({"status":"success","message":"Permission was saved"});
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
		res.json({"status":"error","message":"userid and lockid weren't supplied"});
	}else{
		Permission.remove({"userid": userid, "lockid": lockid}, function(err,permission){
			if(err){
				res.status(500);
				res.json({"status":"error","message":err});
			}else{	
				res.status(200);
				res.json({"status":"success","message":"Permission was deleted successfully"});
			}
		});
	}
	return;
};

exports.updatePermission = function(req,res){
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
		res.json({"status":"error","message":"userid and lockid weren't supplied"});
	} else {
		Permission.findOne({ "userid":userid, "lockid":lockid }, function (err, permission){
			if(!permission){
				res.status(404);
				res.json({"status":"error","message": "Permission doesn't exist"});
			}else if(err){
				res.status(500);
				res.json(err);

			} else {
				switch(frequency) {
					case "always":
						console.log("always.");
						console.log(frequency);
						permission.frequency = frequency;
						permission.date = undefined;
						permission.hours = undefined;
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
						if(!start2){
							console.log(start2);
							permission.frequency = frequency;
							permission.duration = undefined;
							permission.date = date.toLocaleString();
							permission.hours = {
								start : start1,
								end : end1
							}
						} else {
							res.json({"status":"error","message":"frequency 'once' but you gave multiple hours."});
							return;
						}
						break;

				}

				permission.save();
			  	res.status(200);
			  	res.json({"status":"success","message":"succeed update permission."});
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
		res.json({"status":"error","message":"userid and lockid weren't supplied"});
	} else {
		Permission.findOne({ "userid":userid, "lockid":lockid }, function (err, permission){
			if(!permission){
				res.status(404);
				res.json({"status":"error","message": "Permission doesn't exist"});
			}else if(err){
				res.status(500);
				res.json({"status":"error","message":err});
			} else {
				permission.physicalId = physicalId;
				permission.save();
				res.status(200);
				res.json({"status":"success","message":"succeed update permission."});
			}
		});
	}
	return;
};