exports.formateHour = function(hour){
	if(checkHour(hour)){
		if(hour.length == 4){
			hour = "0" + hour;
		}
	return hour;
	}

};

//change from format "DDMMYYYY" to "MMDDYYYY" - the moment library formate.
exports.formateDate = function(date){

	 date = date.split(/[\.\-\,]+/);

	 if(date.length == 3){
		return date[1] + "-" + date[0] + "-" + date[2];
	 }

	 return false;
};