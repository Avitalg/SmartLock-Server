var Message = require('../middlewares/message');
var Permission  = require('../middlewares/permission');
var Logs = require('../middlewares/logs');

/**
main function to write logs into db
**/
exports.writeLog = function(req, res){  
  var username = (req.user)? req.user.username:""; //comes from login

  //sometimes come from body and sometimes from params
  req.params.lockid = (req.params.lockid)? req.params.lockid : req.body.lockid;
  req.params.action = (req.params.action)? req.params.action : req.body.action;
  
  //won't save log if the lockid doesn't exist
  if(!!req.params.lockid){

    //if no username - the request could've been sent from the fingetprint
    if(!username){
      //find username by it's fingerprint
      Permission.getUserByPhysicId(req, res, Logs.writeLog);
    } else {
      //write log without username
      Logs.writeLog(req,res);  
    }  
  }

};
