var mongoose = require('mongoose');
var schema = mongoose.Schema;

var PermissionSchema = new schema({
    userid: {type: String, required:true},
    lockid: {type: String, required:true},
    physicalId: {type: String},
    frequency: { type:String, required:true},
    duration: [String]
},  {collection: 'permissions'});

var Permissions = mongoose.model('Permissions', PermissionSchema);

module.exports = Permissions;

