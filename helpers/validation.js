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
	return (email.indexOf("@")+1<email.indexOf(".")) && (email.indexOf(".") +1 < email.length);
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