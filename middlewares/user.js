var User 	=require('../models/user');
var Message = require('./message');
var valid 	= require('../helpers/validation');
var jwt    	= require('jsonwebtoken'); // used to create, sign, and verify tokens
var config 	= require('../config/main');
var secureRandom = require('secure-random');


/**
get users
**/
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

/**
get user
**/
exports.getUser = function(req,res){
	var username = req.user.username;
		if(!username){
	        Message.messageRes(req, res, 404, "error", "User not logged in");
		}else{	
			User.findOne({"username":username}, function(err,user){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				}else if(!user){
					Message.messageRes(req, res, 404, "error", "User doesn't exist");
				}else{	
					user.password = undefined;
					user.verifyCode = undefined;
					Message.messageRes(req, res, 200, "success", user);
				}
			});
		}
};


/**
get all lock users
**/
exports.getUsersByLock = function(req, res){
	var usernames = req.usersname;

	User.find({"username" : {$in:usernames}},function(err,userRes){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else if(userRes.length == 0){
			Message.messageRes(req, res, 404, "error", "No Users");
		}else{

			for(var i=0; i<userRes.length; i++){
				userRes[i].password = undefined;
				userRes[i].verifyCode = undefined;
			}

			if(!userRes.length){
				userRes.password = undefined;
				userRes.verifyCode = undefined;	
			}

			Message.messageRes(req, res, 200, "success", userRes);
		}
	});

};

/**
add new user
**/
exports.addUser = function(req,res, next){
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
						console.log(saveErr);
                        Message.messageRes(req, res, 500, "error", "server error");
					} else{
						req.subject = "SmartLock - Account Verification"
						req.content = "<h1>Account Verification</h1><div>To continue the registration process, please enter the code below</div><br><div><b>"+newUser.verifyCode[0]+" " +newUser.verifyCode[1]+" "+newUser.verifyCode[2]+" " +newUser.verifyCode[3]+"</b></div><br><div>Best regards,<br>Smart Lock Team.</div>"
                        Message.messageRes(req, res, 200, "success", {"message":"User was saved", "userid": newUser._id});
                        next();
   					}
   				});
			}else if(err){
                Message.messageRes(req, res, 500, "error", err);
			} else {
				console.log(resultUser);
                Message.messageRes(req, res, 200, "error", "User already exists");
			}
			return;
	});
	}

};


/**
add user photo
**/
exports.addUserPhoto = function(req, res){
	var username = req.user.username,
		image = req.body.image;

	if(!username){
        Message.messageRes(req, res, 500, "error", "Not logged in");
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

/**
delete user
**/
exports.removeUser = function(req,res){
	var username= req.user.username;
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


/**
update user
**/
exports.updateUser = function(req,res, next){
	var nusername = req.params.username,
		username = req.user.username,
		phone = req.params.phone;

	if(!username){
        Message.messageRes(req, res, 500, "error", "Need to login");
	} else if(!nusername){
        Message.messageRes(req, res, 500, "error", "No new username was entered");
	} else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else {
		User.findOne({"username": nusername }, function (err, user){
			if(!user){
				user.username = nusername;
				user.phone = phone;
				user.save();
				next();
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				if(username==nusername){
					user.phone = phone;
					user.save();
					return next();
				}
				Message.messageRes(req, res, 404, "error", "User with the username "+username+" already exists");
			}
		});
	}


	return;
};


/**
change user password
**/
exports.changePassword = function(req,res){
	var username = req.user.username,
		password = req.params.password,
		oldpass = req.params.oldpass;

	if(!username){
        Message.messageRes(req, res, 500, "error", "Need to login");
	} else if(!password){
        Message.messageRes(req, res, 500, "error", "No password was entered");
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
			 	user.comparePassword(oldpass, function(err, isMatch) {
		            if (err){
		            	console.log(err);
		            	Message.messageRes(req, res, 500, "error", "server error");
		            }else{
		            	//if username & passwrd were correct
		            	if(isMatch){
		            		user.password = password;
				 			user.save();
		            		Message.messageRes(req, res, 200, "success", "Password changed successfully");
		            	} else {
		            		Message.messageRes(req, res, 200, "error", "wrong password");  
		            	}
		            }
		            
		        });
				 
				 Message.messageRes(req, res, 200, "success", "succeed update user's details.");
			 }
		 });
	 }

	return;
};


/**
forgot password - send random password to user's mail.
gets user's email as username
*/
exports.forgotPassword = function(req, res, next){
	var username = req.params.username;
	req.body.username = username;
	if(!username){
        Message.messageRes(req, res, 500, "error", "No email entered");
	} else if(!valid.checkEmail(username)){
		 Message.messageRes(req, res, 200, "error", "Invalid email");
	 } else {
		 User.findOne({ "username": username }, function (err, user){
			 if(!user){
				 Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			 }else if(err){
				 Message.messageRes(req, res, 500, "error", err);
			 } else {
			 	 var renderPassword = secureRandom.randomArray(4);
			 	 var newPass = "";

			 	 for(var i=0; i<renderPassword.length; i++){
			 	 	newPass += renderPassword[i];
			 	 }

				 user.password = newPass;

				 user.save(function(err, newUser){
				 	if(err){
				 		Message.messageRes(req, res, 404, "error", "Can't save changes - try later.");
				 	} else {
				 		req.endMessage = true;
				 		var message = "According to your request,  we sent you your new password.<br><br> Your new password is:<br><b>"+newPass+"</b><br><br><div>Best regards,<br>Smart Lock Team</div>";
				 		req.subject = "smartLock - Forgot Password";
						req.content = "<h1>Forgot Password</h1><div>"+message+"</div>";

				 		next();
				 	}
				 });
			 }
		 });
	 }

	return;
};

/**
login route
**/
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
				 	console.log(err);
					 Message.messageRes(req, res, 500, "error", "server error");
				 }else if(!user.verified){
				 	 Message.messageRes(req, res, 200, "error", "Need to verify mail first");
				 } else {
				 	//authenticate a user
					 user.comparePassword(password, function(err, isMatch) {
			            if (err){
			            	console.log(err);
			            	Message.messageRes(req, res, 500, "error", "server error");
			            }else{
			            	//if username & passwrd were correct
			            	if(isMatch){
			            		user.password = undefined;
			            		user.__v = undefined;
			            		console.log("user:"+user);

			            		//create a token
			            		var token = jwt.sign(user, config.secret, {
									          expiresIn : 60*60*24 // expires in 24 hours
									        });
			            		Message.messageRes(req, res, 200, "success", {"token":token});
			            	} else {
			            		Message.messageRes(req, res, 200, "error", "wrong password");  
			            	}
			            }
			            
			        });
				 }

		    });
		}
	return;

};

 exports.checkValidCode = function(req, res){
 	var username = req.body.username;
 	var num1 = req.body.num1;
 	var num2 = req.body.num2;
 	var num3 = req.body.num3;
 	var num4 = req.body.num4;
 	var numbers = [num1, num2, num3, num4];

 	if(!username){
        Message.messageRes(req, res, 200, "error", "Need to enter mail");
		return;
	}else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	} else if(isNaN(num1)|| isNaN(num2) || isNaN(num3)|| isNaN(num4)){
		Message.messageRes(req, res, 200, "error", "One or more of the numbers are incorrect");
	}else {
		User.findOne({"username": username }, function (err, user){
			if(!user){
				Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				console.log(user.verifyCode);
				console.log(numbers);

				if(!user.verifyCode || user.verifyCode.length!=4){
					Message.messageRes(req, res, 200, "error", "Invalid code. Please send yourself another code.");
					return;
				}

				for(var i=0; i<user.verifyCode.length;i++){
					if(user.verifyCode[i]!=numbers[i]){
						Message.messageRes(req, res, 200, "error", "The code is incorrect");
						return;
					}
				}

				user.verified = true;
				user.save();
				Message.messageRes(req, res, 200, "success", "Has successfully identified the code");
			}
		});
	}


 };

 exports.sendValidCode = function(req, res, next){
 	var username = req.body.username;
 	if(!username){
        Message.messageRes(req, res, 200, "error", "Need to enter mail");
		return;
	}else if(!valid.checkEmail(username)){
		Message.messageRes(req, res, 200, "error", "Invalid email");
	}else {
		User.findOne({"username": username }, function (err, user){
			if(!user){
				Message.messageRes(req, res, 404, "error", "User with the username "+username+" isn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {

				if(!user.verifyCode || user.verifyCode.length!=4){
					user.verifyCode = [];
					user.save(function(saveErr, newUser){
						req.subject = "SmartLock - Account Verification"
						req.content = "<h1>Account Verification</h1><div>To continue the registration process, please enter the code below</div><br><div><b>"+newUser.verifyCode[0]+" " +newUser.verifyCode[1]+" "+newUser.verifyCode[2]+" " +newUser.verifyCode[3]+"</b></div><br><div>Best regards,<br>Smart Lock Team.</div>"
						req.endMessage = true;
		                next();
					});
				}

				if(user.verifyCode.length == 4){
					req.subject = "SmartLock - Account Verification"
					req.content = "<h1>Account Verification</h1><div>To continue the registration process, please enter the code below</div><br><div><b>"+user.verifyCode[0]+" " +user.verifyCode[1]+" "+user.verifyCode[2]+" " +user.verifyCode[3]+"</b></div><br><div>Best regards,<br>Smart Lock Team.</div>"
					req.endMessage = true;
	                next();
				}
				
			}
		});
	}

 };