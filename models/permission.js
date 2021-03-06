var mongoose = require('mongoose');
var schema = mongoose.Schema;

var PermissionSchema = new schema({
    username: {type: String, required:true},
    lockid: {type: String, required:true},
    physicalId: {type: String},
    frequency: { type:String, required:true},
    date: {type: Date},
    hours : {
        start: {type: String},
        end: {type: String}
    },
    type: {type: Number},
    duration: {
        Sunday: {
            start :{type: String},
            end : {type: String}
        },
        Monday: {
            start :{type: String},
            end : {type: String}
        },
        Tuesday: {
            start :{type: String},
            end : {type: String}
        },
        Wednesday: {
            start :{type: String},
            end : {type: String}
        },
        Thursday: {
            start :{type: String},
            end : {type: String}
        },
        Friday: {
            start :{type: String},
            end : {type: String}
        },
        Saturday: {
            start :{type: String},
            end : {type: String}
        }
    }
},  {collection: 'permissions'});

var Permissions = mongoose.model('Permissions', PermissionSchema);

module.exports = Permissions;

