var Logs = require('../models/logs');
var Message = require('./message');

/**
get user logs according to permissions - if lock manager will see all lock logs,
if not manager, will see only his logs.
**/
exports.getUserLogs = function(req,res){
	var userPermissions = req.UserPer;// all user permissions
	var relevantLogs = [];

	//get all logs
	Logs.find({},
	function(err,logs){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else{
			//if has permissions
			if(userPermissions){
				//go over all permissions
				for(var i=0; i<userPermissions.length; i++){
					//find permission type
					var perType = userPermissions[i].type;

					switch(perType){
						//manager
						case 0:
							//get all logs
							for(var j=0; j< logs.length; j++){
								if(logs[j].lockid == userPermissions[i].lockid){
									relevantLogs.push(logs[j]);
								}
							}
							break;
						//user
						case 1:case 2:
							//get only user logs
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

		}
		return;
	});
};

/**
write log to db
**/
exports.writeLog = function(req,res){
	var username = (req.user)?req.user.username:"Local User",
		otheruser = req.params.otheruser,
	    lockid = req.params.lockid,
	    action = req.params.action,
	    physicId = req.physicId,
	    time = new Date();

	username = username.toLowerCase();

	if(!!lockid){
    	var newlog = new Logs({
			lockid: lockid,
			username: username,
			otheruser: otheruser,
			action: action,
			physicalid: physicId,
			time: time
		});

		newlog.save(function(err, doc){
			if (err){
				console.log("log error");
				console.log(err);
				//Message.messageRes(req, res, 200, "error", err);
			}else{
				console.log("log was saved");
				//Message.messageRes(req, res, 200, "success", doc);
			}
		});
    }		
	console.log("log wasn't saved");
	return;
};

/**
deleting logs when removing permission. this callback doesn't send response but the route before it.
**/
exports.deleteLogs = function(req, res){
	var username = req.params.username,
		lockid = req.params.lockid;

	Logs.remove({"username": username, "lockid": lockid}, function(err,permission){
		if(err){
			console.log(err);
		}else{
			console.log("delete user "+username+ " logs in lock "+ lockid);
		}
	});

	return;
};