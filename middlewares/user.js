var User 	=require('../models/user');
var Message = require('./message');
var valid 	= require('../helpers/validation');
var jwt    	= require('jsonwebtoken'); // used to create, sign, and verify tokens
var config 	= require('../config/main');


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

/**
get current logged in user
**/
exports.getLoggedInUser = function(req, res){
	if(req.user){
		var username = req.user.username;
		//need still to take from db in case his details was changed
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
	} else {
		Message.messageRes(req, res, 200, "error", "Nedd to login");
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
			Message.messageRes(req, res, 200, "success", userRes);
		}
	});

};

/**
add new user
**/
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


/**
change user password
**/
exports.changePassword = function(req,res){
	var username = req.user.username,
		password = req.params.password;
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
				 user.password = password;
				 user.save();
				 Message.messageRes(req, res, 200, "success", "succeed update user's details.");
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
					 Message.messageRes(req, res, 500, "error", err);
				 } else {
				 	//authenticate a user
					 user.comparePassword(password, function(err, isMatch) {
			            if (err){
			            	Message.messageRes(req, res, 200, "error", err);
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
			            		req.token = token;
			            		req.user = user;
			            		console.log("token:" + token);
			            		next();
			            		return;
			            	} else {
			            		Message.messageRes(req, res, 200, "error", "wrong password");  
			            	}
			            }
			            
			        });
				 }

		    });
		}


};

   // Handle verification response
exports.verify = function(request, response) {
    let user = {};

    // Load user model
    User.findById(request.user._id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(request.body.code, postVerify);
    });

    // Handle verification response
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account '
                + '- please enter your token again.');
        }

        // Send confirmation text message
        const message = 'You did it! Signup complete :)';
        user.sendMessage(message, function() {
          // show success page
          request.flash('successes', message);
          response.redirect(`/users/${user._id}`);
        }, function(err) {
          request.flash('errors', 'You are signed up, but '
              + 'we could not send you a message. Our bad :(');
        });
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
};


// Resend a code if it was not received
exports.resend = function(request, response) {
    // Load user model
    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
            return die('User not found for this ID.');
        }

        // If we find the user, let's send them a new code
        user.sendAuthyToken(postSend);
    });

    // Handle send code response
    function postSend(err) {
        if (err) {
            return die('There was a problem sending you the code - please '
                + 'retry.');
        }

        request.flash('successes', 'Code re-sent!');
        response.redirect('/users/'+request.params.id+'/verify');
    }

    // respond with an error
    function die(message) {
        request.flash('errors', message);
        response.redirect('/users/'+request.params.id+'/verify');
    }
};

// Show details about the user
exports.showUser = function(request, response, next) {
    // Load user model
    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
            // 404
            return next();
        }

        response.render('users/show', {
            title: 'Hi there ' + user.fullName + '!',
            user: user,
            // any errors
            errors: request.flash('errors'),
            // any success messages
            successes: request.flash('successes'),
        });
    });

 };