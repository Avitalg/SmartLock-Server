var permissions = require('../middlewares/permission');
var logs = require('../middlewares/logs');
var helps = require('../helpers/logs');

module.exports = function(app){
    app.get('/api/getUserLogs', permissions.getPermissionsByUser, logs.getUserLogs );
    app.post('/api/writeLog', helps.writeLog );
};
