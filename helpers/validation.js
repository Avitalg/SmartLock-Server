var moment = require('moment');
var format = require('./format.js');
var validator = require("email-validator");
var validUrl = require('valid-url');

//for inside function that want to call functions from this file
var _this = this;

/**
email 	string that contains email
should check email is valid
returns  true/false
**/
exports.checkEmail = function(email){
	return validator.validate(email);
};

/**
freq 	string  that contains permission frequency - once\always
return true/false if valid valuee
**/
exports.checkFrequency = function(freq){
	return freq == "once" || freq == "always";
};

/**
get date and check if it is a valid date
returns true/false
**/
exports.checkDate = function(date){
	var date = format.formatDate(date);
	return moment(date).isValid();
};


/**
check permission type - should be between 0 and 2
returns true/false
**/
exports.checkType = function(type){
	return type>=0 && type<=2;
};

/**
check if valid hour - xx:xx/ x:xx
returns true if it is or if 0 
**/
exports.checkHour = function(hour){
	var reg =  /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	return reg.test(hour)|| hour =="0";
};

/**
check if start hour smaller then end hour.
returns true if it is or if end equel to 00:00
**/
exports.checkStartEndHour = function(start, end){
	return start < end || end == "00:00" || (start == "0" &&end == "0");
}

/**
check variables of permission routes - check if they all valid.
return a message with the wrong var or ok if all valid
**/
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


/**
Check variables of temporary permitions
return string with wrong message or ok
**/
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

/**
check lock status - should be open or close
returns true/false
**/
exports.checkStatus = function(status){
	return status == "open" || status == "close";
}

/**
checks lock action - could be only addFingerprint/delFingerprint/unlock/lock/checkStatus
returns true/false
**/
exports.checkLockAction = function(action){
	return action=='addFingerprint'||action=='delFingerprint'||action=='unlock'||action=='lock'||action=='checkStatus';
}

/**
check button action - unlock/lock
returns true/false
**/
exports.checkButtonAction = function(action){
	return action=='unlock'||action=='lock';
}

/**
check if valid url
returns true/false
**/
exports.checkUrl = function(url){
	return validUrl.isUri(url);
}
