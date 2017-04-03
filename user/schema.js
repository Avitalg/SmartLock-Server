var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	userid: {type:Number, auto:true, required:true, index:1, unique:true},
    username: {type:String, required:true, unique:true},
    phone: {type:String, required: true},
    password: {type:String, required:true},
    lockid: [String]
},  {collection: 'users'});

var User = mongoose.model('User', userSchema);

module.exports = User;

