var valid = require('../helpers/validation');


exports.formateHour = function(hour){
	if(valid.checkHour(hour)){
		if(hour.length == 4){
			hour = "0" + hour;
		}
	return hour;
	}

};

exports.getTwoDigitHour = function(time){
	var hour = time;
	if(hour<10){
		hour = "0"+hour;
	}

	return hour;
};

exports.getTwoDigitMinutes = function(time){
	var minutes = time;
	if(minutes<10){
		minutes = "0" + minutes;
	}
	return minutes;
}

exports.formateMinutes = function(hour){
	if(valid.checkMinutes(hour)){
		if(hour.length == 4){
			hour = "0" + hour;
		}
	return hour;
	}

};

//change from format "DDMMYYYY" to "MMDDYYYY" - the moment library formate.
exports.formateDate = function(date){

	if(date){
		date = date.split(/[\.\-\,]+/);
	}

	 if(date.length == 3){
		return date[1] + "-" + date[0] + "-" + date[2];
	 }

	 return false;
};