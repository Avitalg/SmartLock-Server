var consts = require('../consts');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Message = require('../middlewares/message');

// route middleware to verify a token
exports.verifyToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['token'];
  console.log("query:"+req.query.token);
  console.log("body:"+req.body.token);
  console.log("req header:"+req.headers['x-access-token']);
  console.log("token:"+token);

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, consts.secret, function(err, sessionData) {      
      if (err) {
        Message.messageRes(req, res, 200, "error", 'Failed to authenticate token.' );   
      } else {
        // if everything is good, save to request for use in other routes
        console.log(sessionData._doc);
        req.user = sessionData._doc;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        status: "error", 
        message: 'No token provided.' 
    });

  }
};
