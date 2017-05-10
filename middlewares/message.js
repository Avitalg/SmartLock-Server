
exports.helloMessage = function(req,res){
    res.status(200);
    res.send("SmartLockApp");
};

exports.errorMessage = function(req,res){
    res.status(404);
    res.json({"status":"error","message":"wrong url - look at the api - https://github.com/Avitalg/SmartLock-Server/blob/master/README.md"});
};

exports.errorMessageAll = function(req,res){
    res.status(404);
    res.json({"status":"error","message":"URL starts with /api/"});
};


exports.messageRes = function(req,res, status,type, message){
    res.status(status);
    res.json({"status":type,"message": message});
};


