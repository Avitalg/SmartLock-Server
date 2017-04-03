var User=require('./schema');

exports.getUsers = function(req,res){
	User.find({},
	function(err,userRes){
		if(err){
			res.status(500);
			res.json({"error": "No result found."});
		}else{
			res.status(200);
			res.json(userRes);
		}
		return;
	});
};

exports.getUser = function(req,res){
	var userid= req.params.userid;
	if(!userid){
		res.status(404);
		res.json({"error":"userid wasn't supplied"});
	}else{	
		User.findOne({"_id":userid}, function(err,user){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else if(!user){
				res.status(404);
				res.json({"error":"User doesn't exist"});
			}else{	
				res.status(200);
				res.json(user);
			}
		});
	}
	return;
};

exports.addUser = function(req,res){
	var username = req.params.username,
		phone = req.params.phone,
		password = req.params.password;

	if(!username){
		res.status(500);
		res.json({"error":"No username was entered"});
	} else {
		var user = new User({
		  	username: username,
		  	phone: phone,
		  	password: password
		});
		User.findOne({ "username": username }, function (err, resultUser){
			if(!resultUser){
					user.save(function(saveErr){
					if(saveErr){
						res.status(500);
						res.json({error:saveErr});
					} else{
						res.status(200);
   						res.json({"success":"User was saved"});
   					}
   				});
			}else if(err){
				res.status(500);
				res.json({error:err});
			} else {
				res.status(200);
   				res.json({"error":"username already exist"});
			}
			return;
	});
	}

};

exports.removeUser = function(req,res){
	var userid= req.params.userid;
	if(!userid){
		res.status(404);
		res.json({"error":"Userid wasn't supplied"});
	}else{
		User.remove({"_id":userid}, function(err,user){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else{
				res.status(200);
				res.json({"success":"User was deleted successfully"});
			}
		});
	}
	return;
};

exports.updateUser = function(req,res){
	var userid = req.params.userid,
		username = req.params.username,
		phone = req.params.phone,
		password = req.params.password;

	if(!userid){
		res.status(500);
		res.json({"error":"No userid was entered"});
	} else {
		User.findOne({ "_id": userid }, function (err, user){
			if(!user){
				res.status(404);
				res.json({error: "User with the userid "+userid+" isn't exist"});
			}else if(err){
				res.status(500);
				res.json({error:err});
			} else {
				user.username = username;
			  	user.phone = phone;
				user.password = password;
			  	user.save();
			  	res.status(200);
			  	res.json({"success":"succeed update user's details."});
			}
		});
	}
	return;

};

exports.errorMessage = function(req,res){
	res.json({"error":"wrong url - look at the api - https://github.com/Avitalg/SmartLock-Server/blob/master/README.md"});
}

exports.errorMessageAll = function(req,res){
	res.json({"error":"URL starts with /api/"});
}