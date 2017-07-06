"use strict";

var Permission  = require('../models/permission');
var Message 	= require('./message');
var moment 		= require('moment');
var valid 		= require('../helpers/validation');
var format 		= require('../helpers/format');
var nodemailer 	= require('nodemailer');
var Logs 		= require('../helpers/logs');
var config 		= require('../config/main');
var physicId 	= require('../helpers/physicalId');
var mongoose 	= require('mongoose');

var _this = this;

/**
get all permissions
**/
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

/**
get user permissions
**/
exports.getPermission = function(req,res){
	var username= req.params.username, // from session
		lockid = req.params.lockid;

	if(!username){
		Message.messageRes(req, res, 200, "error", "Need to enter username");
	}else if(!lockid){
		Message.messageRes(req, res, 200, "error", "lockid didn't supplied");
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
	var username = req.user.username;

	if(!username){
		Message.messageRes(req, res, 200, "error", "Need to login");
	} else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
		} else {
			Permission.find({"username":username}, function(err,perResult){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				} else if(!perResult){
					Message.messageRes(req, res, 404, "error", "Permission doesn't exist");
				} else {

					if(req.route.stack.length > 1){
						console.log("k");
						req.UserPer = perResult;
						next();
						return;
					} else {
						console.log("r");
						Message.messageRes(req, res, 200, "success", perResult);
					}
		
				}
			});
		}

		return;
	
};

exports.getManagerLocks = function(req, res, next){
	var username = req.user.username;
	var lockids = [];
	Permission.findOne({"username":username, "type":0}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){//no manager of any lock
			next();
		}else{
			if(!perResult.length){
				lockids.push(perResult.lockid);
			}
			for(var i=0; i<perResult.length; i++){
				lockids.push(perResult[i].lockid);
			}

			req.lockids = lockids;
			next();
		}
	});
};

/**
internal function - get user by it's physicalid
**/
exports.getUserByPhysicId = function(req, res, next){
  var lockid = req.params.lockid,
      physicalId = (req.physicId) ? req.physicId:req.body.fingerId;

    Permission.findOne({"lockid":lockid, "physicalId": physicalId}, function(err,perResult){
      if(perResult){
        req.user.username = perResult.username;
        req.user._id = perResult._id;
        req.user.phone = perResult.phone;
      }
      next(req, res);
    });

};

/**
get all pysucal ids
**/
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
				//add to physicalId all physical ids that exist in this lock
				for(var i=0; i<perResult.length; i++){
					if(!!perResult[i].physicalId){
						physicalId.push(perResult[i].physicalId);
					}
				}
			} else { // only one permission found
				physicalId.push(perResult.physicalId);
			}
			//get minimun pysical id avilable
			physicValue = physicId.findMinimumPhysId(physicalId);
			req.physicId = physicValue;

			_this.updatePhysicalId(req,res,next);
		}
	});
	return;

};

/**
get all locks permissions
**/
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
				if(req.route.stack.length > 1 && !req.hasManger){
					//get all usernames that have permissions to lock
					for(var i=0; i<perResult.length; i++){
						usersname.push(perResult[i].username);
					}

					req.usersname = usersname; //transfer usernames to next route
					next();

				} else {
					console.log("getPermissionsByLock else (no  next)");
					Message.messageRes(req, res, 200, "success", perResult);	
				}

				
			}
	});
	return;
};


/**
get all managers of lock by it's lockid
**/
exports.getLockManagers = function(req, res){
	var lockid = req.params.lockid;

	if(!lockid){
		Message.messageRes(req, res, 404, "error", "No lockid entered");
		return;	
	}

	Permission.find({"lockid":lockid, "type":0}, function(err,perResult){

		if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!perResult){
				Message.messageRes(req, res, 404, "error", "No managers");
			}else{

				var usernames =[];
				for(var i=0; i<perResult.length;i++){
					usernames.push(perResult[i].username);
				}

				if(perResult.length == 1){
					usernames.push(perResult.username);
				}

				Message.messageRes(req, res, 200, "success", usernames);	
			}
	});
	return;

};

/**
check if lock has manager. save data in req.hasMnager
**/
exports.checkIfHasManager = function(req, res, next){
	var lockid = (req.params.lockid)? req.params.lockid : req.body.lockid;

	console.log("check if has manager");
	Permission.findOne({"lockid":lockid, "type":0}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){//no managers in lock
			if(req.route.stack.length > 1){
				_this.addManagerPermission(req, res, _this.sendEmail(req, res));
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



/**
 * after we check if lock has manager
 * @param req
 * @param res
 * @param next
 */
exports.checkManagerPermissions = function(req, res, next){
	var username = req.user.username,
		lockid = req.params.lockid ? req.params.lockid : req.body.lockid;


	console.log("checkManagerPermissions");
	console.log("check if "+ username + " is the manager of "+lockid);
	Permission.findOne({"lockid":lockid, "username":username, "type":0}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 200, "error", err);
		}else if(!perResult){//no managers in lock
			Message.messageRes(req, res, 200, "error", "only manager can do this action.");
		}else{
			console.log("has manager ");
			req.hasManger = true;
			next();
		}
	});

	

	return;
};

/**
check user permissions according to what saved in db. validate permissions
**/
exports.validPermissions = function(username, lockid){
	var promise = new mongoose.Promise;

	return Permission.findOne({"username":username, "lockid":lockid}).exec().then(
		function(perResult){
			if(!perResult){
				return "Permission doesn't exist";
			}else{
				//format current hour
				var hour = format.getTwoDigitHour(new Date().getHours());
				//format current digit
				var minutes = format.getTwoDigitMinutes(new Date().getMinutes());
				
				var currHour = hour + ":" + minutes;
				var dateCond = false; //special condition that need to happen
				console.log("currHour:"+currHour);
				switch(perResult.frequency){// check frequency
					case "once":
						var startHour = perResult.hours.start;
						var endHour = perResult.hours.end;
						var perDate = perResult.date.setHours(0,0,0,0);
						var currDate = new Date().setHours(0,0,0,0) ;
						dateCond =  perDate == currDate; // current date should be the same as saved

						console.log("cond:"+dateCond);
						console.log("starthour:"+startHour);
						console.log("endHour:"+endHour);
						console.log("currdate:"+currDate);
						console.log("perDate:"+perDate);
						break;
					case "always":
						var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
						var currDay = days[new Date().getDay()];//get current day
						var hours = perResult.duration[currDay];// get the hours of current day
						dateCond = true; //check according to hours
						var startHour = hours.start;
						var endHour = hours.end;
						if(startHour == '0' || endHour=='0') dateCond = false; //no permissions for this day
						break;
				}
				
				//check if has permissions
				if(dateCond && (currHour >= startHour && (currHour <= endHour|| endHour == "00:00")) ){
					 return "Has permissions";
				} else {
					return "No permissions";
				}
			}
		}, function(){
			return "Permission doesn't exist";
		});

};

exports.checkPermission = function(req, res, next){
	var username= req.user.username,
		lockid = (req.params.lockid)? req.params.lockid : req.body.lockid;
		console.log("checkper:"+req.body.lockid);
	if(!username){
		Message.messageRes(req, res, 404, "error", "Need to login");
	}else if(!lockid){
		Message.messageRes(req, res, 404, "error", "lockid wasn't supplied");
	} else if(!valid.checkEmail(username)) {
		Message.messageRes(req, res, 200, "error", "username is Invalid email");
	}
	else{
		var checkPer = _this.validPermissions(username, lockid);

		//promise - need to validate permissions and only then continue
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

/**
**/
exports.fingerPrintPermission = function(req, res, next){
	var lockid = req.body.lockid,
		username = req.user.username;

	if(!username){
		Message.messageRes(req, res, 404, "error", "Need to login");
	}

	Permission.findOne({"lockid":lockid, "username":username}, function(err,perResult){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(!perResult){
			Message.messageRes(req, res, 404, "error", "No permissions.");
		}else{
			//if manager or has permissions for fingerprint
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

/**
check for the right permissions - 
	to do fingerprint actions need fingerprint permissions
	to do lock actions - need to check permissions (day and hours)
**/
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


/**
add manager permission - always (hours and days)
**/
exports.addManagerPermission = function(req, res, next){
	 
	var start1, start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6, end7,
		username = req.body.username,
		lockid = req.body.lockid,
		frequency = "always",
		type = 0,
		validation = "no";
	start1 = start2 = start3 = start4 = start5 = start6 = start7 = "00:00";
	end1 = end2 = end3 = end4 = end5 = end6 = end7   = "23:59";
	console.log("has manager addManagerPermission");
	validation = valid.checkPermissionVars(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6,end7);

	if(!username){
		Message.messageRes(req, res, 500, "error", "Need to login");
	} else if(!lockid){
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
		Permission.findOne({"username": username, "lockid": lockid},
			function(err, doc){
				console.log("save manager per");
				if (!!doc){
					Message.messageRes(req, res, 500, "error", "Permission already exists");
				}else{
					req.params.action = "add manager Permissions";
					Logs.writeLog(req, res);
					if(req.route.stack.length > 1 && !!next){
						console.log("next");
						next();
						return;
					}

					permission.save(function(err, perResult){

						if(err){
							Message.messageRes(req, res, 200, "error", "Can't save manager permission");

						} else {
							Message.messageRes(req, res, 200, "success", "Manager permission was saved");

						}

					});
				}
		});

	}			
};


/**
add user permissions
**/
exports.addPermission = function(req,res, next){
	var username = req.body.username,
		lockid = req.body.lockid,
		frequency = req.body.frequency,
		date = req.body.date,
		type = req.body.type,
		start1 = format.formatHour(req.body.start1),
		start2 = format.formatHour(req.body.start2),
		start3 = format.formatHour(req.body.start3),
		start4 = format.formatHour(req.body.start4),
		start5 = format.formatHour(req.body.start5),
		start6 = format.formatHour(req.body.start6),
		start7 = format.formatHour(req.body.start7),
		end1   = format.formatHour(req.body.end1),
		end2   = format.formatHour(req.body.end2),
		end3   = format.formatHour(req.body.end3),
		end4   = format.formatHour(req.body.end4),
		end5   = format.formatHour(req.body.end5),
		end6   = format.formatHour(req.body.end6),
		end7   = format.formatHour(req.body.end7);

	var validation = false; 

	//validate vars
	if(frequency == "always"){
		validation = valid.checkPermissionVars(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
		end1, end2, end3, end4, end5, end6,end7);
	} else if (frequency == "once"){
		validation = valid.checkShortPermissionVars(username,lockid,frequency, date, type, start1,end1);
	}

	console.log("sdsd");
	
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
				console.log("always");
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
				permission.date = format.formatDate(date);
				permission.hours = {
					start : start1,
					end : end1
				}
		}

		//if User exist, won't save him.
		Permission.findOne({"username": username, "lockid": lockid},
			function(err, doc){
				if (!!doc){
					Message.messageRes(req, res, 500, "error", "Permission already exists");
				}else{
					if(req.route.stack.length > 1){
						req.subject = 'Smart Lock - New Permissions';
						req.content = "<h1>Congratulations!</h1><p>you've been received new permissions in SmartLock app.<br>You can download the app from the app store. </p><p>Click <a href='https://play.google.com/apps/testing/niravitalzohar.smartlock.smartlock'>here</a> to download the app.</p><p>Best regards,<br>Smart Lock Team.</p>";
						next();
					}
					console.log("find user");
					console.log(doc);

					permission.save(function(err, perSaved){
						console.log("saved");
						if(err){
							Message.messageRes(req, res, 500, "error", err);

						} else {
							req.params.action = "addPermissions";
							Logs.writeLog(req, res);
							Message.messageRes(req, res, 200, "success", "Permission was saved");
						}

					});


				}
			});
	}
	return;	
};


/**
delete permission
**/
exports.removePermission = function(req,res, next){
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
				next();
			}
		});
	}
	return;
};

/**
remove user physicalId
**/
exports.removePhysicalId = function(req, res, next){
	var username = req.user.username,
		lockid = req.body.lockid;
	if(!username){
		Message.messageRes(req, res, 404, "error", "Need to login");
	} else if(!username && !lockid){
		Message.messageRes(req, res, 404, "error", "username and lockid weren't supplied");
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


/**
remove user permissions
**/
exports.removeUserPermissions = function(req,res, next){
	var username = req.user.username;

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


/**
remove lock permissions
**/
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

/**
update permission
**/
exports.updatePermission = function(req,res){
	var username = req.params.username,
		lockid = req.params.lockid,
		frequency = req.params.frequency,
		type = req.params.type,
		date = req.params.date,
		start1 = format.formatHour(req.params.start1),
		start2 = format.formatHour(req.params.start2),
		start3 = format.formatHour(req.params.start3),
		start4 = format.formatHour(req.params.start4),
		start5 = format.formatHour(req.params.start5),
		start6 = format.formatHour(req.params.start6),
		start7 = format.formatHour(req.params.start7),
		end1   = format.formatHour(req.params.end1),
		end2   = format.formatHour(req.params.end2),
		end3   = format.formatHour(req.params.end3),
		end4   = format.formatHour(req.params.end4),
		end5   = format.formatHour(req.params.end5),
		end6   = format.formatHour(req.params.end6),
		end7   = format.formatHour(req.params.end7);

	var validation = false;
 	
 	//if frequency always
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
							permission.date = new Date(format.formatDate(req.params.date));
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

/**
change user permissions type - 0,1,2 (manager, fingerprint and regular user)
**/
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

/**
update physical id
**/
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

/**
change username
**/
exports.changePermissionUsername = function(req, res){
	var nusername = req.params.username,
		username = req.user.username;
	if(!valid.checkEmail(username) || !valid.checkEmail(nusername)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else {
		Permission.update({ "username":username}, {username: nusername}, {multi: true}, function (err){
			Message.messageRes(req, res, 200, "success", "succeed update user's details.");
		});
	}

};

exports.contactUs = function(req, res, next){
	var username = req.body.username;
	var message = req.body.message;

	req.subject = "contact us - smartLock";
	req.content = "<h2>Message from "+username+"</h2><div>"+message+"</div>";
	req.body.username = "info@smartlockproj.com";
	req.endMessage = true;
	console.log("next");
	next();
};


/**
send user email about new permissions
**/
exports.sendEmail = function(req, res){
	var username = req.body.username;

	console.log(username);
	console.log(req.endMessage);

	//check if EMAIL_USER && EMAIL_PASS defined - vars on Heroku
	if(config.EMAIL_USER =="x" || config.EMAIL_PASS == "x"){
		console.log("config vars not defined. Email didn't sent");
		if(!!req.endMessage){
			console.log("endmsg");
			Message.messageRes(req, res, 200, "error", "Can't send mail");
		}
		return;
	}

	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: config.EMAIL_USER, 
			pass: config.EMAIL_PASS
		}
	});

	var mailOptions = {
		from: 'no-reply@smartLock.com', 
		to: username, 
		subject: req.subject,
		html: req.content
	};

	transporter.sendMail(mailOptions, function(error, info){
		console.log(info);
		console.log(error);
		console.log("ok");
		if(error){
			console.log(error);
			console.log({yo: 'error' });
			if(!!req.endMessage){
				Message.messageRes(req, res, 200, "error", "Can't send mail");
				return;
			}
		}else{

			console.log('Message sent: ' + info.response);
			console.log({yo: info.response});
			if(!!req.endMessage){
				Message.messageRes(req, res, 200, "success", "Thank you!");
				return;
			}
		};
	});

	//Message.messageRes(req, res, 200, "error", "Can't send mail");

};