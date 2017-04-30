var User=require('../models/user');
var Message = require('./message');

exports.getUsers = function(req,res){
	User.find({},
	function(err,userRes){
		if(err){
			res.status(500);
			res.json({"status":"error","message": "No result found."});
		}else{
			res.status(200);
			res.json(userRes);
		}
		return;
	});
};

exports.getUser = function(req,res){
	var username= req.params.username,
		lockid = req.params.lockid

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
		res.status(500);
		res.json({"status":"error","message":"No username was entered"});
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
						res.status(500);
						res.json({"status":"error","message":saveErr});
					} else{
						res.status(200);
   						res.json({"status":"success","message":"User was saved", "userid": newUser._id});
   					}
   				});
			}else if(err){
				res.status(500);
				res.json({"status":"error","message":err});
			} else {
				res.status(200);
   				res.json({"status":"error","message":"username already exist"});
			}
			return;
	});
	}

};

exports.removeUser = function(req,res){
	var userid= req.params.userid;
	if(!userid){
		res.status(404);
		res.json({"status":"error","message":"Userid wasn't supplied"});
		return;
	}
	User.remove({"_id":userid}, function(err,user){
		if(err){
			res.status(500);
			res.json({"status":"error","message":err});
		}else{
			res.status(200);
			res.json({"status":"success","message":"User was deleted successfully"});
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
		res.status(500);
		res.json({"status":"error","message":"No userid was entered"});
		return;
	}

	User.findOne({ "username": username }, function (err, user){
		if(!user){
			res.status(404);
			res.json({"status":"error","message": "User with the username "+username+" isn't exist"});
		}else if(err){
			res.status(500);
			res.json({error:err});
		} else {
			user.username = username;
			user.phone = phone;
			user.password = password;
			user.save();
			res.status(200);
			res.json({"status":"success","message":"succeed update user's details."});
		}
	});

	return;
};