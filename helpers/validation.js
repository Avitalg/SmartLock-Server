var moment = require('moment');
var Permission  = require('../models/permission');
var Formate = require('./formate.js');

exports.checkPermissions = function(username, lockid){

	Permission.findOne({"username":username, "lockid":lockid}, function(err,perResult){
		if(err){
			return err;
		}else if(!perResult){
			return "Permission doesn't exist";
		}else{
			var hour = new Date().getHours();
			if(hour<10){
				hour = "0"+hour;
			}
			var currHour = hour + ":" + new Date().getMinutes();
			var cond = false;
			switch(perResult.frequency){
				case "once":
					var startHour = perResult.hours.start;
					var endHour = perResult.hours.end;
					cond = perResult.date == new Date().setHours(0,0,0,0) ;
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

			if(cond && (currHour >= startHour && currHour <= endHour) ){
				return "Has permissions";
			} else {
				return "No permissions";
			}
		}
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

	return reg.test(hour);
};

exports.checkPermissionVars = function(username,lockid,	frequency, date, type, start1,start2, start3, start4, start5, start6, start7,
									   end1, end2, end3, end4, end5, end6,end7){
	var message="ok";

	if(!checkEmail(username)){
		message = "Invalid email";
	}

	if(!checkFrequency(frequency)){
		message = "Wrong frequency";
	}

	if(!checkDate(date)){
		message = "Invalid date";
	}

	if(!checkType(type)){
		message = "Wrong type";
	}

	if(!checkHour(start1) || !checkHour(start2) || !checkHour(start3) || !checkHour(start4) ||
		!checkHour(start5) || !checkHour(start6) || !checkHour(start7) || !checkHour(end1) ||
		!checkHour(end2) || !checkHour(end3) || !checkHour(end4) || !checkHour(end5) || !checkHour(end6) ||
		!checkHour(end7)){
		message = "Not all hours are valid";
	}

	return message;
};

exports.checkShortPermissionVars = function(username,lockid, frequency, date, type, start,end){
	var message="ok";

	if(!checkEmail(username)){
		message = "Invalid email";
	}

	if(!checkFrequency(frequency)){
		message = "Wrong frequency";
	}

	if(!checkDate(date)){
		message = "Invalid date";
	}

	if(!checkType(type)){
		message = "Wrong type";
	}

	if(!checkHour(start) || !checkHour(end)){
		message = "Not all hours are valid";
	}

	return message;
};

exports.checkStatus = function(status){
	return status == "opem" || status == "close";
}