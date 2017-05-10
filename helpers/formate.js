var valid = require('../helpers/validation');


exports.formateHour = function(hour){
	if(valid.checkHour(hour)){
		if(hour.length == 4){
			hour = "0" + hour;
		}
	return hour;
	}

};

//change from format "DDMMYYYY" to "MMDDYYYY" - the moment library formate.
exports.formateDate = function(date){

	 if(date && date.length == 3){
	 	date = date.split(/[\.\-\,]+/);
		return date[1] + "-" + date[0] + "-" + date[2];
	 }

	 return false;
};