var Permission  = require('../models/permission');

exports.getPhysicalId = function(lockid){
	var physicalId = [];
	Permission.find({"lockid":lockid}, function(err,perResult){
		if(err){
			return -1;
		}else if(!perResult){
			return -1;
		}else{
			if(perResult.length>0){
				for(var i=0; i<perResult.length; i++){
					if(!!perResult[i].physicalId){
						physicalId.push(perResult[i].physicalId);
					}
				}
			} else { // only one permission found
				physicalId.push(perResult[i].physicalId);
			}

			return findMinimumPhysId(physicalId);
			
		}
	});

};

//returns minimum value available between 0 and 162
var findMinimumPhysId = function(pIds){
	if(pIds.length == 163){
		return -1;
	}

	for(var i =0; i<163; i++){
		if(pIds.indexOf(i)==-1){
			console.log("find min:"+i);
			return i;
		}
	}

};