"use strict";

var Permission  = require('../models/permission');
var Message = require('./message');
var moment = require('moment');
var valid = require('../helpers/validation');
var format = require('../helpers/formate');
var nodemailer = require('nodemailer');
var Logs = require('../helpers/logs');
var config = require('../consts');


var _this = this;

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
		Message.messageRes(req, res, 200, "error", "username or lockid didn't supplied");
	}else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
	}else {
		Permission.findOne({"username":username, "lockid":lockid}, function(err,perResult){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else if(!perResult){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			} else {
				Message.messageRes(req, res, 200, "success", perResult);
			}
		});
	}
	return;
};


exports.getPermissionsByUser = function(req, res, next){

	console.log("getPermissions");

	console.log("params:");
	console.log(req.params);
	console.log(req.params.username);
	var username = req.params.username;

	if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
		} else {
			Permission.find({"username":username}, function(err,perResult){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				} else if(!perResult){
					Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
				} else {

					if(req.route.stack.length > 1){
						req.UserPer = perResult;
						next();
					} else {
						Message.messageRes(req, res, 200, "success", perResult);					
					}
		
				}
			});
		}

		return;
	
};

exports.getPermissionsByUserTest = function(req, res, next){
	
	if(req.session && req.session.user){
		var username = req.session.user.username;

	if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
		} else {
			Permission.find({"username":username}, function(err,perResult){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				} else if(!perResult){
					Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
				} else {

					if(req.route.stack.length > 1){
						req.UserPer = perResult;
						next();
					} else {
						Message.messageRes(req, res, 200, "success", perResult);					
					}
		
				}
			});
		}

		return;
	} else {
		Message.messageRes(req, res, 200, "error", "Not logged in");
	}
	
};

exports.getPermissionsByLock = function(req,res, next){
	var lockid = req.params.lockid;
	var usersname=[];
	console.log("getPermissionsByLock");
	Permission.find({"lockid":lockid}, function(err,perResult){
		if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(perResult.length == 0){
				Message.messageRes(req, res, 404, "error", "No permissions for this lockid");
			}else{
				//if given next function
				if(req.route.stack.length > 1){
					for(var i=0; i<perResult.length; i++){
						usersname.push(perResult[i].username);
					}

					req.usersname = usersname;
					next();

				} else {
					console.log("else");
					Message.messageRes(req, res, 200, "success", perResult);	
				}

				
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

};

exports.checkIfHasManager = function(req, res, next){
	var lockid = (req.params.lockid)? req.params.lockid : req.body.lockid;

	Permission.findOne({"lockid":lockid, "type":0}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){//no managers in lock
			if(req.route.stack.length > 1){
				req.hasManager = false;
				next();
			} else {
				Message.messageRes(req, res, 404, "error", "No manager");
			}
		}else{
			if(req.route.stack.length > 1){
				req.hasManager = true;
				next();
			} else {
				Message.messageRes(req, res, 200, "success", "Has manager");
			}
		}
	});
	return;

};

exports.checkPermission = function(req, res, next){
	var username= (req.params.username)? req.params.username : req.body.username,
		lockid = (req.params.lockid)? req.params.lockid : req.body.lockid;
		console.log("checkper:"+req.body.lockid);
	if(!username && !lockid){
		Message.messageRes(req, res, 404, "error", "Details weren't supplied");
	} else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
	}
	else{
		var checkPer = valid.checkPermissions(username, lockid);
		checkPer.then(function(result){
			switch(result){
				case "Has permissions":
					if(req.route.stack.length > 1){
						next();						
					} else {
						Message.messageRes(req, res, 200, "success", result);
					}
					break;
				case "No permissions":
					Message.messageRes(req, res, 200, "error", result);
					break;
				default:
					Message.messageRes(req, res, 404, "error", result);
			}
		}, function(reason) {
  console.log(reason);
});

		
	}
	return;
};

exports.fingerPrintPermission = function(req, res, next){
	var lockid = req.body.lockid,
		username = req.body.username;

	Permission.findOne({"lockid":lockid, "username":username}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){
			Message.messageRes(req, res, 404, "error", "No permissions.");
		}else{
			if(perResult.type == 0 || perResult.type == 1){
				if(req.route.stack.length > 1){
					next();	
				} else {
					Message.messageRes(req, res, 200, "success", "Has permissions.");		
				}
								
			} else {
				Message.messageRes(req, res, 400, "error", "No permissions.");	
			}
		}
	});
	return;
}

exports.rightPermission = function(req, res, next){
	var action = req.params.action;

	if(!valid.checkLockAction(action)){
        Message.messageRes(req, res, 404, "error", "undefine action");
        return;
    }

	switch(action){
		case "addFingerprint": case "delFingerprint":
			_this.fingerPrintPermission(req, res, next);
			break;
		case "unlock": case "lock": case "checkStatus":
			_this.checkPermission(req, res, next);
			break;

	}
};

exports.addManagerPermission = function(req, res, next){
	 
	var start1, start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6, end7,
		username = req.body.username,
		lockid = req.body.lockid,
		frequency = "always",
		type = 0,
		validation = "no";
	start1 = start2 = start3 = start4 = start5 = start6 = start7 = "00:00",
	end1 = end2 = end3 = end4 = end5 = end6 = end7   = "23:59";
	console.log("haS MANAGE:"+req.hasManager);
	validation = valid.checkPermissionVars(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6,end7);

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else if(validation!="ok"){
		Message.messageRes(req, res, 200, "error", validation);
	} else if(req.hasManager){
		Message.messageRes(req, res, 200, "error", "lock has manager");
	}else{
		var permission = new Permission({
			username: username,
			lockid: lockid,
			frequency: frequency,
			type: type,
			duration : {
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
			}
		});

	//if User exist, won't save him.
		Permission.findOneAndUpdate({"username": username, "lockid": lockid}, permission, {upsert:true},
			function(err, doc){
				if (err){
					Message.messageRes(req, res, 500, "error", "Permission already exists");
				}else{
					req.params.action = "add manager Permissions";
					Logs.writeLog(req, res);
					if(req.route.stack.length > 1){
						next();
						return;
					}
					Message.messageRes(req, res, 200, "success", "Permission was saved");
				}
		});

	}			
}

exports.addPermission = function(req,res, next){
	var username = req.body.username,
		lockid = req.body.lockid,
		frequency = req.body.frequency,
		date = req.body.date,
		type = req.body.type,
		start1 = format.formateHour(req.body.start1),
		start2 = format.formateHour(req.body.start2),
		start3 = format.formateHour(req.body.start3),
		start4 = format.formateHour(req.body.start4),
		start5 = format.formateHour(req.body.start5),
		start6 = format.formateHour(req.body.start6),
		start7 = format.formateHour(req.body.start7),
		end1   = format.formateHour(req.body.end1),
		end2   = format.formateHour(req.body.end2),
		end3   = format.formateHour(req.body.end3),
		end4   = format.formateHour(req.body.end4),
		end5   = format.formateHour(req.body.end5),
		end6   = format.formateHour(req.body.end6),
		end7   = format.formateHour(req.body.end7);

	var validation = false; 

	
	if(frequency == "always"){
		validation = valid.checkPermissionVars(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6,end7);
	} else if (frequency == "once"){
		validation = valid.checkShortPermissionVars(username,lockid,frequency, date, type, start1,end1);
	}


	
		if(!username && !lockid){
			Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
		} else if(validation!="ok"){
			Message.messageRes(req, res, 200, "error", validation);
		}else{
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
					permission.date = format.formateDate(date);
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
						if(req.route.stack.length > 1){
							next();
						}
						req.params.action = "addPermissions";
						Logs.writeLog(req, res);
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
	}else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
	}else{
		Permission.remove({"username": username, "lockid": lockid}, function(err,permission){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				req.params.action = "removePermission";
				Logs.writeLog(req, res);
				Message.messageRes(req, res, 200, "success", "Permission was deleted successfully");
			}
		});
	}
	return;
};

exports.removePhysicalId = function(req, res, next){
	var username = req.body.username,
		lockid = req.body.lockid;

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {
 		Permission.findOne({ "username":username, "lockid":lockid }, function (err, permission){
 			if(!permission){
 				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
 			}else if(err){
 				Message.messageRes(req, res, 200, "error", "Can't remove physicalId");
 			} else {
 				req.physicId = parseInt(permission.physicalId);
 				permission.physicalId = undefined;
 				permission.save();
				Logs.writeLog(req, res);
 				//if next function was defined
 				if(req.route.stack.length > 1){
 					next();
 				} else {
 					Message.messageRes(req, res, 200, "success", {message : "succeed remove physicalId."});
 				}
 			}
 		});	 
	}
	return;
};

exports.removeUserPermissions = function(req,res, next){
	var username = req.params.username;

	if(!username){
		Message.messageRes(req, res, 404, "error", "username wasn't supplied");
	}else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
	}else{
		Permission.remove({"username": username}, function(err,permission){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				if(req.route.stack.length > 1){
					next();
				} else {
					Message.messageRes(req, res, 200, "success", "Permissions were deleted successfully");
				}
			}
		});
	}
	return;	
};

exports.removeLockPermissions = function(req,res, next){
	var lockid = req.params.lockid;

	if(!lockid){
		Message.messageRes(req, res, 404, "error", "lockid wasn't supplied");
	}else{
		Permission.remove({"lockid": lockid}, function(err,permission){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				if(req.route.stack.length > 1){
					next();
				} else {
					Message.messageRes(req, res, 200, "error", "Permissions were deleted successfully");
				}	
			}
		});
	}
	return;	
}

exports.updatePermission = function(req,res){
	var username = req.params.username,
		lockid = req.params.lockid,
		frequency = req.params.frequency,
		type = req.params.type,
		date = req.params.date,
		start1 = format.formateHour(req.params.start1),
		start2 = format.formateHour(req.params.start2),
		start3 = format.formateHour(req.params.start3),
		start4 = format.formateHour(req.params.start4),
		start5 = format.formateHour(req.params.start5),
		start6 = format.formateHour(req.params.start6),
		start7 = format.formateHour(req.params.start7),
		end1   = format.formateHour(req.params.end1),
		end2   = format.formateHour(req.params.end2),
		end3   = format.formateHour(req.params.end3),
		end4   = format.formateHour(req.params.end4),
		end5   = format.formateHour(req.params.end5),
		end6   = format.formateHour(req.params.end6),
		end7   = format.formateHour(req.params.end7);

	var validation = false;
 
	if(start2){
		validation = valid.checkPermissionVars(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
			end1, end2, end3, end4, end5, end6,end7);
	} else {
		validation = valid.checkShortPermissionVars(username,lockid, frequency, date, type, start1,end1);
	}

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else if(validation != "ok"){
		Message.messageRes(req, res, 200, "error", validation);
	} else {
		Permission.findOne({ "username":username, "lockid":lockid }, function (err, permission){
			if(!permission){
				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				console.log(permission);
				permission.frequency = frequency;
				permission.type = type;
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
							permission.date = new Date(format.formateDate(req.params.date));
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
				
				permission.save(function(err,doc){
					if(err){
						Message.messageRes(req, res, 200, "error", err);
					}else{
						req.params.action = "updatePermission";
						Logs.writeLog(req, res);
						Message.messageRes(req, res, 200, "success", "succeed update permission.");
					}
				});
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
	} else if(!valid.checkType) {
		Message.messageRes(req, res, 200, "error", "Wrong type");
	}else {
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

exports.updatePhysicalId = function(req,res,next){
	var username = req.params.username,
		lockid = req.params.lockid,
		physicalId = req.physicId;

	if(!username && !lockid){
		Message.messageRes(req, res, 500, "error", "username and lockid weren't supplied");
	} else {
		 	if(physicalId > -1){
		 		Permission.findOne({ "username":username, "lockid":lockid, $or:[{"type":1}, {"type":0}] }, function (err, permission){
		 			if(!permission){
		 				Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
		 			}else if(err){
		 				Message.messageRes(req, res, 500, "error", err);
		 			} else {
		 				permission.physicalId = physicalId;
		 				permission.save();
		 				req.params.action = "updatePhysicalId";
						Logs.writeLog(req, res);
		 				if(req.route.stack.length > 1){
		 					next();
		 				} else {
		 					Message.messageRes(req, res, 200, "success", {message : "succeed update physicalId.", physicalId : physicalId});
		 				}
		 			}
		 		});
		 	} else {
		 		Message.messageRes(req, res, 200, "error", "Can't update physicalId");
		 	}

	}
	return;
};

exports.changePermissionUsername = function(req, res){
	var nusername = req.params.nusername,
		username = req.params.username;
	if(!valid.checkEmail(username) || !valid.checkEmail(nusername)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else {
		Permission.update({ "username":username}, {username: nusername}, {multi: true}, function (err){
			Message.messageRes(req, res, 200, "success", "succeed update user's details.");
		});
	}

};

exports.sendEmail = function(req, res){
	var username = req.body.username,
		lockid = req.body.lockid,
		frequency = req.body.frequency,
		date = req.body.date,
		type = req.body.type;


	if(config.EMAIL_USER =="x" || config.EMAIL_PASS == "x"){
		console.log("config vars not defined. Email didn't sent");
		return;
	}

	//need to secure this details
	var transporter = nodemailer.createTransport({
		service: 'SendGrid',
		auth: {
			user: "no-reply@smartlockproj.com", 
			pass: "noRep578912@4"
		}
	});

	var mailOptions = {
		from: 'no-reply@smartLock.com', 
		to: username, 
		subject: 'Smart Lock - New Permissions',
		html: "<h1>Congratulations!</h1><p>you've been received new permissions in SmartLock app.<br>You can download the app from the app store.</p><p>Best regards,<br>Smart Lock Team.</p>",
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			console.log({yo: 'error' });
		}else{
			req.params.action = "sendEmail";
			Logs.writeLog(req, res);
			console.log('Message sent: ' + info.response);
			console.log({yo: info.response});
		};
	});


};


exports.getUserLogs = function(req, res){
	var logs = Logs.getLogs();
	var userPermissions = req.UserPer;
	var relevantLogs = [];

	console.log(req.params.username);
	console.log(userPermissions);
	console.log(logs);
	if(userPermissions){
		for(var i=0; i<userPermissions.length; i++){

			var perType = userPermissions[i].type;

			switch(perType){
				//manager
				case 0:
					for(var j=0; j< logs.length; j++){
						if(logs[j].lockid == userPermissions[i].lockid){
							relevantLogs.push(logs[j]);
						}
					}
					break;
				//user
				case 1:case 2:
					for(var j=0; j< logs.length; j++){
						if((logs[j].lockid == userPermissions[i].lockid) && (logs[j].username == userPermissions[i].username) ){
							relevantLogs.push(logs[j]);
						}
					}
					break;
			}
		}
		Message.messageRes(req, res, 200, "success", relevantLogs);
	} else {
		Message.messageRes(req, res, 200, "error", "No permissions");
	}
	
	return;

};