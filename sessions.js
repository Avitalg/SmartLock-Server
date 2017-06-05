var express = require('express');
var expressSession  = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var consts = require('./consts');

module.exports = function() {
  var session = expressSession({
    secret: 'foo',
	rolling: true,
	saveUninitialized: false,
	resave: true,
	cookie: {
	    httpOnly: false,
	    secure: true,
	    domain: consts.domain,
	    maxAge: 24*60*60*1000 //one hour
	},
	store: new MongoStore({url : consts.mongoUrl})
  });

  return session;
};

