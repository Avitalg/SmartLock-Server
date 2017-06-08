var fs = require('fs');
var Message = require('../middlewares/message');
var Permission  = require('../models/permission');
var Logs = require('../middlewares/logs');

exports.writeLog = function(req, res){  
  req.params.username = (req.params.username)? req.params.username : req.body.username,
  req.params.lockid = (req.params.lockid)? req.params.lockid : req.body.lockid,
  req.params.action = (req.params.action)? req.params.action : req.body.action;
  
  if(!req.params.username && req.session && req.session.user){
    req.params.username = req.session.user.username;
  }

  if(!req.params.username){
    getUsernameByPhsicId(req, res, Logs.writeLog);
  } else {
    Logs.writeLog(req,res);  
  }

};

var getUsernameByPhsicId = function(req, res, next){
  var lockid = req.params.lockid,
      physicalId = req.physicId;

    Permission.findOne({"lockid":lockid, "physicalId": physicalId}, function(err,perResult){
      if(perResult){
        req.params.username = perResult.username;
      }
      next(req, res);
    });

};

var writeLogToFile = function(req, res){
  var filename = "logs.json";
  var logs = JSON.parse(fs.readFileSync(filename, 'utf8'));


  var jsonLog = {
    "username": req.params.username,
    "lockid": req.params.lockid,
    "action": req.params.action,
    "physicId": req.physicId,
    "time": new Date()
  };

  logs.push(jsonLog);

  fs.writeFile(filename, JSON.stringify(logs), 'utf8');

};

exports.getLogs = function(){
	var filename = "logs.json";
    return JSON.parse(fs.readFileSync(filename, 'utf8'));

};
