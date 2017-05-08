
exports.getPhysicalId = function(lockid){
	Permission.find({"lockid":lockid}, function(err,perResult){
		if(err){
			return err;
		}else if(!perResult){
			return "Permission doesn't exist";
		}else{
			var physicalId = [];
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
	return;
};

//returns minimum value available between 0 and 162
var findMinimumPhysId = function(pIds){
	if(pIds.length == 163){
		return -1;
	}

	for(var i =0; i<163; i++){
		if(x.indexOf(i)==-1){
			return i;
		}
	}

};