var moment = require('moment');
var Permission  = require('../models/permission');
var Formate = require('./formate.js');
var User=require('../models/user');
var mongoose = require('mongoose');

var _this = this;

exports.checkPermissions = function(username, lockid){
	var promise = new mongoose.Promise;

	return Permission.findOne({"username":username, "lockid":lockid}).exec().then(
		function(perResult){
			if(!perResult){
				return "Permission doesn't exist";
			}else{
				var hour = new Date().getHours();
				
				if (typeof process.env.ENV_VAR == 'production') {
					hour+=3;
					console.log("prod");
				}

				console.log("hour:"+hour);

				var minutes = new Date().getMinutes();
				if(hour<10){
					hour = "0"+hour;
				}
				if(minutes<10){
					minutes = "0" + minutes;
				}
				var currHour = hour + ":" + minutes;
				var cond = false;
				console.log("currHour:"+currHour);
				switch(perResult.frequency){
					case "once":
						var startHour = perResult.hours.start;
						var endHour = perResult.hours.end;
						var perDate = perResult.date.setHours(0,0,0,0);
						var currDate = new Date().setHours(0,0,0,0) ;
						cond =  perDate == currDate;

						console.log("cond:"+cond);
						console.log("starthour:"+startHour);
						console.log("endHour:"+endHour);
						console.log("currdate:"+currDate);
						console.log("perDate:"+perDate);
						break;
					case "always":
						var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
						var currDay = days[new Date().getDay()];
						var hours = perResult.duration[currDay];
						cond = true;
						var startHour = hours.start;
						var endHour = hours.end;
						break;
				}
				

				if(cond && (currHour >= startHour && (currHour <= endHour)|| endHour == "00:00") ){
					 return "Has permissions";
				} else {
					return "No permissions";
				}
			}
		}, function(){
			return "Permission doesn't exist";
		});

};

exports.checkUserExist = function(username){
	var promise = new mongoose.Promise;

	return User.findOne({"username":username}).exec()
	.then(function(user){
			if(!user){
				return false;
			}else{	
				return true;
			}
		}, function(){
			return false;
		});
	return;
};


exports.checkEmail = function(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

exports.checkFrequency = function(freq){
	return freq == "once" || freq == "always";
};


exports.checkDate = function(date){
	var date = Formate.formateDate(date);
	return moment(date).isValid();
};

exports.checkType = function(type){
	return type>=0 && type<=2;
};


exports.checkHour = function(hour){
	var reg =  /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	return reg.test(hour)|| hour =="0";
};

exports.checkStartEndHour = function(start, end){
	return start < end || end == "00:00";
}

exports.checkPermissionVars = function(username,lockid,	frequency, type, start1,start2, start3, start4, start5, start6, start7,
									   end1, end2, end3, end4, end5, end6,end7){
	var message="ok";

	if(!_this.checkEmail(username)){
		message = "Invalid email";
	}

	if(!_this.checkFrequency(frequency)){
		message = "Wrong frequency";
	}

	if(!_this.checkType(type)){
		message = "Wrong type";
	}

	if(!_this.checkStartEndHour(start1,end1) || !_this.checkStartEndHour(start2,end2) || !_this.checkStartEndHour(start3,end3)
		|| !_this.checkStartEndHour(start3,end3) || !_this.checkStartEndHour(start4,end4) || !_this.checkStartEndHour(start5,end5)
		|| !_this.checkStartEndHour(start6,end6) || !_this.checkStartEndHour(start7,end7)){
			message = "Not all start hours are bigger then the end hours";		
	}

	if(!_this.checkHour(start1) || !_this.checkHour(start2) || !_this.checkHour(start3) || !_this.checkHour(start4) ||
		!_this.checkHour(start5) || !_this.checkHour(start6) || !_this.checkHour(start7) || !_this.checkHour(end1) ||
		!_this.checkHour(end2) || !_this.checkHour(end3) || !_this.checkHour(end4) || !_this.checkHour(end5) || !_this.checkHour(end6) ||
		!_this.checkHour(end7)){
		message = "Not all hours are valid";
	}

	return message;
};

exports.checkShortPermissionVars = function(username,lockid, frequency, date, type, start,end){
	var message="ok";

	if(!_this.checkEmail(username)){
		message = "Invalid email";
	}

	console.log(start + " " + end);

	if(!_this.checkFrequency(frequency)){
		message = "Wrong frequency";
	}

	if(!_this.checkDate(date)){
		message = "Invalid date";
	}

	if(!_this.checkType(type)){
		message = "Wrong type";
	}
 
 	if(!_this.checkHour(start) || !_this.checkHour(end)){
		message = "Not all hours are valid";
	}

	if(!_this.checkStartEndHour(start,end)){
			message = "Not all start hours are bigger then the end hours";		
	}

	return message;
};

exports.checkStatus = function(status){
	return status == "open" || status == "close";
}

exports.checkLockAction = function(action){
	return action=='addFingerprint'||action=='delFingerprint'||action=='unlock'||action=='lock'||action=='checkStatus';
}