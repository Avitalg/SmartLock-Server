var valid = require('../helpers/validation');

/**
Format string hour to be "xx:xx"
**/
exports.formatHour = function(hour){
	if(valid.checkHour(hour)){
		if(hour.length == 4){
			hour = "0" + hour;
		}
	return hour;
	}

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

	if(date){
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