var mongoose = require('mongoose');
var schema = mongoose.Schema;

var locksSchema = new schema({
    lockid: {
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    action: {
        type: String
    },
    username: {
        type: String
    },
    physicalid:{
        type: String
    },
    time : { 
        type : Date, 
        default: Date.now 
    }



},  {collection: 'logs'});

var Locks = mongoose.model('Logs', locksSchema);

module.exports = Locks;

