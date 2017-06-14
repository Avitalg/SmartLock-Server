/**
 * Created by Nir Shchori on 06/05/2017.
 */
var valid = require('../helpers/validation');
var Message = require('./message');
var logs = require('../helpers/logs');

var requests = {};
var lockRequestQueue = {};
exports.requestLockAction = function(req,res,next){
        var username = req.user.username, //from session
            lockId = req.body.lockid,
            action = req.params.action,//validate legal type
            physicId = req.physicId, //get physicId from db
            time = new  Date().getTime();

        console.log("requestLockAction");
        console.log("user:"+ username);
        console.log("lockid:"+lockId);
        console.log("action:"+action);
        console.log("physicId:"+physicId);

        if(!valid.checkLockAction(action)){
            console.log("action");
            Message.messageRes(req, res, 404, "error", "undefine action");
            return;
        }
        if (!username) {
            Message.messageRes(req, res, 404, "error", "Need to login");
            return;
        }
        if (!lockId) {
            Message.messageRes(req, res, 404, "error", "missing lockid");
            return;
        }

        var requestId = username + time;
        requests[requestId] = {
            'action' : action,
            'username' : username,
            'lockId' : lockId,
            'time' :  time,
            'status' : 'unhandle'
        };
        var requestLock = {
            'action': action,
            'requestId' : requestId
        };
        if(requests[requestId].action =="addFingerprint" ||requests[requestId].action =="delFingerprint"  ){
            requests[requestId].fingerprintId = physicId; //add minimum unuse id between 0 to 162
            requestLock.fingerprintId = requests[requestId].fingerprintId;
        }
        if(!lockRequestQueue[lockId]){
            lockRequestQueue[lockId] = [];
        }

        console.log(lockRequestQueue);

        logs.writeLog(req, res);

        lockRequestQueue[lockId].push(requestLock);
        res.status(201).json({'status': 'request created', 'requestId' : requestId});

};

exports.checkLockAction = function(req,res,next){
        if(req.params.requestId && requests[req.params.requestId]){
            var responseJson = JSON.parse(JSON.stringify(requests[req.params.requestId]));
            var now = new Date().getTime();
            if (requests[req.params.requestId].time+30000 < now){
                responseJson.status = 'timeout';
            }
            if (responseJson.status != 'unhandle'){
                delete requests[req.params.requestId];
            }
            res.status(200).json(responseJson);
        }else {
            res.status(500).json({});
        }

};

exports.checkLockRequest = function (req,res,next) {
        if(lockRequestQueue[req.params.lockId] && lockRequestQueue[req.params.lockId].length> 0) {
            var now = new Date().getTime();
            while(lockRequestQueue[req.params.lockId].length>0){
                var lockreq = lockRequestQueue[req.params.lockId].shift();
                if(requests[lockreq.requestId].time+30000>now){ //
                    res.status(200).json(lockreq);
                    return;
                }
            }
        }
        res.status(200).json({"action":"no action needed"});
};

exports.updateLockRequest = function (req,res,next) {
        var requestId = req.body.requestId,
            status = req.body.status;
        if (!requestId) {
            res.status(404).json({status:"missing requestId"});
        }else if(!requests[requestId]){
            res.status(500).json({status:"illegel requestId"});
        }else{
            requests[requestId].status = status;
            res.status(200).end();
        }

};

exports.updateLocalButtonAction = function (req,res,next){
    var lockId = req.params.lockid,
        action  = req.body.action,
        fingerprintId = req.body.fingerId;

    console.log("updatelocalButtonAction");
    console.log("lockid:"+lockId);
    console.log("action:"+action);
    console.log("fingerprintId:"+fingerprintId);
    
    if(!valid.checkButtonAction(action)){
        Message.messageRes(req, res, 404, "error", "undefined action");
        return;
    }
    if (!lockId) {
        Message.messageRes(req, res, 404, "error", "missing lockid");
        return;
    }


    if(fingerprintId) {
        req.physicId = fingerprintId;
        //identify user by fingerprintId
    }

    logs.writeLog(req, res);

    res.status(200).end();
};
