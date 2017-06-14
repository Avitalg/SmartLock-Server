var User=require('../models/user');
var Message = require('./message');
var valid = require('../helpers/validation');

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
	// var user;
	// if(req.session && req.session.user){
	// 	user = req.session.user;
	// 	user.password = undefined;
	// 	Message.messageRes(req, res, 200, "success", user);
	// 	return;
	// }
	// Message.messageRes(req, res, 200, "error", "Not logged in");
	var username = req.params.username;
		if(!username){
	        Message.messageRes(req, res, 404, "error", "username wasn't supplied");
		}else{	
			User.findOne({"username":username}, function(err,user){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				}else if(!user){
					Message.messageRes(req, res, 404, "error", "User doesn't exist");
				}else{	
					user.password = undefined;
					Message.messageRes(req, res, 200, "success", user);
				}
			});
		}
};

exports.isLoggedIn = function(req, res){
	if(req.session && req.session.user){
		Message.messageRes(req, res, 200, "success", "true");
		return;
	}

	Message.messageRes(req, res, 200, "success", "false");
};

exports.getLoggedInUser = function(req, res){
	var user;

	if(req.session && req.session.user){
		var username = req.session.user.username;
		if(!username){
	        Message.messageRes(req, res, 404, "error", "username wasn't supplied");
		}else{	
			User.findOne({"username":username}, function(err,user){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				}else if(!user){
					Message.messageRes(req, res, 404, "error", "User doesn't exist");
				}else{	
					user.password = undefined;
					Message.messageRes(req, res, 200, "success", user);
				}
			});
		}
		return;
	} else {
		Message.messageRes(req, res, 200, "error", "Not logged in");
	}
};

exports.getUsersByLock = function(req, res){
	var usernames = req.usersname;

	User.find({"username" : {$in:usernames}},function(err,userRes){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(userRes.length == 0){
			Message.messageRes(req, res, 404, "error", "No Users");
		}else{	
			Message.messageRes(req, res, 200, "success", userRes);
		}
	});

};

exports.addUser = function(req,res){
	var username = req.body.username,
		phone = req.body.phone,
		password = req.body.password;

	if(!username){
        Message.messageRes(req, res, 200, "error", "No username was entered");
	} else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else if(!phone){
		Message.messageRes(req, res, 200, "error", "Need to enter phone number");
	}else if(!password){
		Message.messageRes(req, res, 200, "error", "Need to enter password");
	}else {
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

exports.addUserPhoto = function(req, res){
	var nusername = req.body.username,
		image = req.body.image;

	if(!username){
        Message.messageRes(req, res, 500, "error", "No username or new username was entered");
		return;
	}else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else if(!valid.checkUrl(image)){
		Message.messageRes(req, res, 200, "error", "Invalid image url");
	}else {
		User.findOne({"username": username }, function (err, user){
			if(!user){
				Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				user.image = image;
				user.save();
				next();
			}
		});
	}


	return;
};

exports.removeUser = function(req,res){
	var username= req.params.username;
	if(!username){
        Message.messageRes(req, res, 404, "error", "Userid wasn't supplied");
		return;
	}else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	}else {
		User.remove({"username":username}, function(err,user){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				Message.messageRes(req, res, 200, "success", "User was deleted successfully");
			}
		});
	}


	return;
};

exports.updateUser = function(req,res, next){
	var nusername = req.params.nusername,
		username = req.params.username,
		phone = req.params.phone;

	if(!username || !nusername){
        Message.messageRes(req, res, 500, "error", "No username or new username was entered");
		return;
	}else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else {
		User.findOne({"username": username }, function (err, user){
			if(!user){
				Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				user.username = nusername;
				user.phone = phone;
				user.save();
				next();
			}
		});
	}


	return;
};


exports.changePassword = function(req,res){
	var username = req.params.username,
		password = req.params.password;
	
	 if(!username || !password){
        Message.messageRes(req, res, 500, "error", "No username or password was entered");
		return;
	}else if(!valid.checkEmail(username)){
		 Message.messageRes(req, res, 200, "error", "Invalid email");
	 } else {
		 User.findOne({ "username": username }, function (err, user){
			 if(!user){
				 Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			 }else if(err){
				 Message.messageRes(req, res, 500, "error", err);
			 } else {
				 user.password = password;
				 user.save();
				 Message.messageRes(req, res, 200, "success", "succeed update user's details.");
			 }
		 });
	 }

	return;
};


exports.login = function(req, res, next){
	var username = req.body.username,
		password = req.body.password;

		if(!username){
			Message.messageRes(req, res, 200, "error", "no username was entered");
		} else if(!password){
			Message.messageRes(req, res, 200, "error", "no password was entered");
		}else{
			// fetch user and test password verification
		    User.findOne({ username: username }, function(err, user) {
		    	if(!user){
					 Message.messageRes(req, res, 200, "error", "User with the username "+username+" isn't exist");
				 }else if(err){
					 Message.messageRes(req, res, 500, "error", err);
				 } else {
					 user.comparePassword(password, function(err, isMatch) {
			            if (err){
			            	Message.messageRes(req, res, 200, "error", err);
			            }else{
			            	if(isMatch){
			            		next();
			            	} else {
			            		Message.messageRes(req, res, 200, "error", "wrong password");  
			            	}
			            }
			            
			        });
				 }

		    });
		}


};