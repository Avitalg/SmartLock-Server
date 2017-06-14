var valid = require('../helpers/validation');

var _this = this;

exports.formateHour = function(hour){
	if(!!hour && hour!='0'){
		var res = hour.split(":");
		var hour = _this.getTwoDigitHour(res[0]);
		var minutes = _this.getTwoDigitMinutes(res[1]);
		console.log(hour + ":" + minutes);
		return hour + ":" + minutes;	
	}
	return hour;
};

exports.getTwoDigitHour = function(time){
	var hour = time;
	if(hour.length == 1){
		hour = "0"+hour;
	}

	return hour;
};

exports.getTwoDigitMinutes = function(time){
	var minutes = time;
	if(minutes.length == 1){
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