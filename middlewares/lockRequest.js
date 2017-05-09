/**
 * Created by I325775 on 06/05/2017.

 */
var valid = require('../helpers/validation');

var requests = {};
var lockRequestQueue = {};
exports.requestLockAction = function(req,res,next){
        var userId = req.body.userId,
            lockId = req.body.lockId,
            action = req.params.action,//validate legal type
            time = new  Date().getTime();
        if(action!='addFingerprint'&&action!='delFingerprint'&&action!='unlock'&&action!='lock'&&action!='checkStatus'){
            res.status(404).send("undefine action");

        }
        if (!userId) {
            res.status(404).send("missing userId");
        }
        if (!lockId) {
            res.status(404).send("missing lockId");
        }
        //todo:add verify userId and lockId and type
        if(!valid.checkType(action)){
            res.status(404).send("Wrong type");
        }
        //todo: add permission check

        if(valid.checkPermissions(userId, lockId) == "No permissions"){
            res.status(404).send("missing lockId");
        }

        var requestId = userId + time;
        requests[requestId] = {
            'action' : action,
            'userId' : userId,
            'lockId' : lockId,
            'time' :  time,
            'status' : 'unhandle'
        };
        var requestLock = {
            'action': action,
            'requestId' : requestId
        };
        if(requests[requestId].action =="addFingerprint" ||requests[requestId].action =="delFingerprint"  ){
            requests[requestId].fingerprintId = (Math.random()*100)%150; //add minimum unuse id between 0 to 162
            requestLock.fingerprintId = requests[requestId].fingerprintId;
        }
        if(!lockRequestQueue[lockId]){
            lockRequestQueue[lockId] = [];
        }
        lockRequestQueue[lockId].push(requestLock);
        res.status(201).json({'status': 'request created', 'requestId' : requestId});

};
exports.checkLockAction = function(req,res,next){
        if(req.params.requestId && requests[req.params.requestId]){
            var responseJson = JSON.parse(JSON.stringify(requests[req.params.requestId]));
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
            var lockreq = lockRequestQueue[req.params.lockId].shift();
            if(requests[lockreq.requestId].time+100000>now){ //
                res.status(200).json(lockreq);
            }
        }

        res.status(200).json({"action":"no action needed"});

};
exports.updateLockRequest = function (req,res,next) {
        var requestId = req.body.requestId,
            status = req.body.status;
        if (!requestId) {
            res.status(404).json({status:"missing requestId"});
        }
        if(!requests[requestId]){
            res.status(500).json({status:"illegel requestId"});
        }else{
            requests[requestId].status = status;
            res.status(200).end();
        }

};