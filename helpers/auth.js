var config = require('../config/main');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Message = require('../middlewares/message');

/**
route middleware to verify a token
**/
exports.verifyToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['token'];
  console.log("query:"+req.query.token);
  console.log("body:"+req.body.token);
  console.log("req header:"+req.headers['x-access-token']);
  console.log("token:"+token);

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, sessionData) {      
      if (err) {
        Message.messageRes(req, res, 200, "error", 'Failed to authenticate token.' );   
      } else {
        // after verifying, add user to request so we could use in other routes. 
        console.log(sessionData._doc);
        req.user = sessionData._doc;    
        next();
      }
    });

  } else {//if no token was found - error message will send
    Message.messageRes(req, res, 404, "error", 'No token provided.' );   
  }
};
