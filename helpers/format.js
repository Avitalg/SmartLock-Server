var valid = require('../helpers/validation');
var moment = require('moment-timezone');
/**
Format string hour to be "xx:xx"
**/
exports.formatHour = function(hour){
	if(!hour && valid.checkHour(hour)){

		if(hour.length == 4){
			hour = "0" + hour;
		}
	}

	return hour;


};

exports.getLocalDates = function(permissions){
	
	for(var i=0;i<permissions.length; i++){
		if(!!permissions[i].date){
			var date = new Date(permissions[i].date.setHours(permissions[i].date.getHours() + 3));
			permissions[i].date = date;
		}
	}
//Asia/Jerusalem
	if(permissions.length == 0){
		permissions.date = new Date(permissions.date.toString());	
	}

	return permissions;
};

/**
Format only the hour - need to be 2 digits - "xx".
returns the correct format.
**/
exports.getTwoDigitHour = function(time){
	var hour = time;
	if(hour<10){
		hour = "0"+hour;
	}

	return hour;
};

/**
Format only the minutes - should be 2 digit. 
returns the correct format
**/
exports.getTwoDigitMinutes = function(time){
	var minutes = time;
	if(minutes<10){
		minutes = "0" + minutes;
	}
	return minutes;
}

/**
change from format "DDMMYYYY" to "MMDDYYYY" - the moment library format.
**/
exports.formatDate = function(date){

	if(!!date){
		//separate date by .\-\,
		date = date.split(/[\.\-\,]+/);

		//if the length is exactly 3 - valid date (format of 'x-x-x') 
		if(date.length == 3){
			//change the place of the months and days
			return date[1] + "-" + date[0] + "-" + date[2];
		}

	}

	return false;
};