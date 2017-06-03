var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    username: {type:String, required:true, unique:true},
    phone: {type:String, required: true},
    password: {type:String, required:true},
    image: {type:String}
},  {collection: 'users'});

var User = mongoose.model('User', userSchema);

module.exports = User;

