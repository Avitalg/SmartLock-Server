var mongoose = require('mongoose');
var schema = mongoose.Schema;

var PermissionSchema = new schema({
    userid: {type: Number, required:true},
    lockid: {type: Number, required:true},
    physicalId: {type: Number},
    frequency: { type:Number, required:true},
    duration: [String]
},  {collection: 'permissions'});

var Permissions = mongoose.model('Permissions', PermissionSchema);

module.exports = Permissions;

