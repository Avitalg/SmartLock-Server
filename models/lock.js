var mongoose = require('mongoose');
var schema = mongoose.Schema;

var locksSchema = new schema({
    lockid: {
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},  {collection: 'locks'});

var Locks = mongoose.model('Locks', locksSchema);

module.exports = Locks;