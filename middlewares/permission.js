"use strict";

var Permission  = require('../models/permission');
var Message = require('./message');
var moment = require('moment');
var valid = require('../helpers/validation');
var physicId = require('../helpers/physicalId');

exports.getPermissions = function(req,res){
	Permission.find({},
	function(err,permissionRes){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else{
			Message.messageRes(req, res, 200, "success", permissionRes);
		}
	});
	return;
};

exports.getPermission = function(req,res){
	var username= req.params.username,
		lockid = req.params.lockid;

	if(!username && !lockid){
	}else{
		Permission.findOne({"username":username, "lockid":lockid}, function(err,perResult){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perResult){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else{
				Message.messageRes(req, res, 200, "success", perResult);
			}
		});
	}
	return;
};


exports.getPermissionsByUser = function(req,res){
	var username = req.params.username;

	Permission.find({"username":username}, function(err,perResult){
		if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perResult){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else{
				Message.messageRes(req, res, 200, "success", perResult);
			}
	});
	return;
};

exports.getPermissionsByLock = function(req,res){
	var lockid = req.params.lockid;

	Permission.find({"lockid":lockid}, function(err,perResult){
		if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perResult){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else{
				Message.messageRes(req, res, 200, "success", perResult);
			}
	});
	return;
};

exports.getLockManager = function(req, res){
	var lockid = req.params.lockid;

	Permission.findOne({"lockid":lockid, "type":0}, function(err,perResult){
		if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perResult){
				Message.messageRes(req, res, 404, "error", "The lock "+lockid+" has no manager");
			}else{
				Message.messageRes(req, res, 200, "success", perResult);
			}
	});
	return;

}

exports.checkPermission = function(req, res, next){
	var username= req.params.username,
		lockid = req.params.lockid;

	if(!username && !lockid){
		Message.messageRes(req, res, 404, "error", "Details weren't supplied");
	}else{
		var checkPer = valid.checkPermissions(username, lockid);

		switch(checkPer){
			case "Has permissions":
				next();
				break;
			case "No permissions":
				Message.messageRes(req, res, 200, "error", checkPer);
				break;
			default:
				Message.messageRes(req, res, 404, "error", checkPer);

		}
	}
	return;
};

exports.addPermission = function(req,res){
	var username = req.body.username,
		lockid = req.body.lockid,
		frequency = req.body.frequency,
		date = req.body.date,
		type = req.body.type,
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

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {

		var permission = new Permission({
			username: username,
			lockid: lockid,
			frequency: frequency,
			type: type
		});

		switch(frequency) {
			case "always":
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
				permission.date = new Date(date);
				permission.hours = {
					start : start1,
					end : end1
				}
		}

		//if User exist, won't save him.
		Permission.findOneAndUpdate({"username": username, "lockid": lockid}, permission, {upsert:true},
			function(err, doc){
				if (err){
					Message.messageRes(req, res, 500, "error", "Permission already exists");
				}else{
					Message.messageRes(req, res, 200, "success", "Permission was saved");
				}
			});
	}
	return;

};

exports.removePermission = function(req,res){
	var username = req.params.username,
		lockid = req.params.lockid;
	if(!username && !lockid){
		Message.messageRes(req, res, 404, "error", "username and lockid weren't supplied");
	}else{
		Permission.remove({"username": username, "lockid": lockid}, function(err,permission){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				Message.messageRes(req, res, 200, "error", "Permission was deleted successfully");
			}
		});
	}
	return;
};

exports.updatePermission = function(req,res){
	var username = req.params.userid,
		lockid = req.params.lockid,
		frequency = req.params.frequency,
		type = req.params.type,
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


	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {
		Permission.findOne({ "userid":username, "lockid":lockid }, function (err, permission){
			if(!permission){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				permission.type = type;
				permission.frequency = "always";
				console.log(frequency);
				switch(frequency) {
					case "always":
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
							permission.duration = undefined;
							permission.date = date.toLocaleString();
							permission.hours = {
								start : start1,
								end : end1
							}
						} else {
							Message.messageRes(req, res, 200, "error", "frequency 'once' but you gave multiple hours.");
							return;
						}
						break;

				}

				permission.save();
				Message.messageRes(req, res, 200, "success", "succeed update permission.");
			}
		});
	}
	return;

};

exports.changeUserType = function(req, res){
	var username = req.params.username,
		lockid = req.params.lockid,
		type = req.params.type;

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {
		Permission.findOne({ "username":username, "lockid":lockid }, function (err, permission){
			if(!permission){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				permission.type = type;
				permission.save();
				Message.messageRes(req, res, 200, "success", "succeed update user type.");
			}
		});
	}
	return;
};

exports.updatePhysicalId = function(req,res){
	var username = req.params.username,
		lockid = req.params.lockid;
		let physicalIdPromise;

		// 	physicalIdPromise = new Promise(function(resolve, reject){
		// 	console.log("hello");
		// 	var physicalId = physicId.getPhysicalId(lockid);
		// 	console.log("xxx-"+physicalId);

		// 	if(physicalId || physicalId == 0){
		// 		console.log("in promise-"+physicalId);
		// 		resolve(physicalId);
		// 	} else{
		// 		reject("test");
		// 	}
		// });	
	

	
	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {
		Message.messageRes(req, res, 200, "error", "Can't update physicalId");
		// console.log("ok");
		// physicalIdPromise.then(function(promiseResult){
		// 	console.log("update:"+promiseResult);
		// 	if(promiseResult > -1){
		// 		Permission.findOne({ "username":username, "lockid":lockid }, function (err, permission){
		// 			if(!permission){
		// 				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
		// 			}else if(err){
		// 				Message.messageRes(req, res, 500, "error", err);
		// 			} else {
		// 				permission.physicalId = promiseResult;
		// 				permission.save();
		// 				Message.messageRes(req, res, 200, "success", {message : "succeed update physicalId.", physicalId : promiseResult});
		// 			}
		// 		});	
		// 	} else {
		// 		Message.messageRes(req, res, 200, "error", "Can't update physicalId");
		// 	}

		// }).catch(function(e) {
		// 	console.log("error:"+e);
		// });
	}
	return;
};

exports.changePermissionUsername = function(req, res){
	var nusername = req.params.nusername,
		username = req.params.username;

	Permission.update({ "username":username}, {username: nusername}, {multi: true}, function (err){
		Message.messageRes(req, res, 200, "success", "succeed update user's details.");
	});
}