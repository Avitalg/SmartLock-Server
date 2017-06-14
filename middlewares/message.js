
exports.helloMessage = function(req,res){
    res.status(200);
    res.send("SmartLockApp");
};

/**
when user enter to the wrong url - Suggesting that he will see the docs in github
**/
exports.errorMessage = function(req,res){
    res.status(404);
    res.json({"status":"error","message":"wrong url - look at the api - https://github.com/Avitalg/SmartLock-Server/blob/master/README.md"});
};

/**
when user doesn't enter '/api/' - remind it to him
**/
exports.errorMessageAll = function(req,res){
    res.status(404);
    res.json({"status":"error","message":"URL starts with /api/"});
};

/**
generic response message
**/
exports.messageRes = function(req,res, status,type, message){
    res.status(status);
    res.json({"status":type,"message": message});
};


