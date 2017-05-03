var User=require('../models/user');
var Message = require('./message');

exports.getUsers = function(req,res){
	User.find({},
	function(err,userRes){
		if(err){
            Message.messageRes(req, res, 500, "error", "No result found.");
		}else{
            Message.messageRes(req, res, 200, "success", userRes);
		}
		return;
	});
};

exports.getUser = function(req,res){
	var username= req.params.username,
		lockid = req.params.lockid;

	if(!username){
		res.status(404);
		res.json({"status":"error","message":"username wasn't supplied"});
	}else{	
		User.findOne({"username":username}, function(err,user){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!user){
				Message.messageRes(req, res, 404, "error", "User doesn't exist");
			}else{	
				Message.messageRes(req, res, 200, "success", user);
			}
		});
	}
	return;
};

exports.addUser = function(req,res){
	var username = req.body.username,
		phone = req.body.phone,
		password = req.body.password;

	if(!username){
        Message.messageRes(req, res, 500, "error", "No username was entered");
	} else {
		var user = new User({
		  	username: username,
		  	phone: phone,
		  	password: password
		});
		User.findOne({ "username": username }, function (err, resultUser){
			if(!resultUser){
					user.save(function(saveErr, newUser){
					if(saveErr){
                        Message.messageRes(req, res, 500, "error", saveErr);
					} else{
                        Message.messageRes(req, res, 200, "success", {"message":"User was saved", "userid": newUser._id});
   					}
   				});
			}else if(err){
                Message.messageRes(req, res, 500, "error", err);
			} else {
                Message.messageRes(req, res, 200, "error", "User already exists");
			}
			return;
	});
	}

};

exports.removeUser = function(req,res){
	var userid= req.params.userid;
	if(!userid){
        Message.messageRes(req, res, 404, "error", "Userid wasn't supplied");
		return;
	}
	User.remove({"_id":userid}, function(err,user){
		if(err){
            Message.messageRes(req, res, 500, "error", err);
		}else{
            Message.messageRes(req, res, 200, "success", "User was deleted successfully");
		}
	});

	return;
};

exports.updateUser = function(req,res){
	var userid = req.params.userid,
		username = req.params.username,
		phone = req.params.phone,
		password = req.params.password;

	if(!userid){
        Message.messageRes(req, res, 500, "error", "No userid was entered");
		return;
	}

	User.findOne({ "username": username }, function (err, user){
		if(!user){
            Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
		}else if(err){
            Message.messageRes(req, res, 500, "error", err);
		} else {
			user.username = username;
			user.phone = phone;
			user.password = password;
			user.save();
            Message.messageRes(req, res, 200, "success", "succeed update user's details.");
		}
	});

	return;
};