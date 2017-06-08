var permissions = require('../middlewares/permission');
var logs = require('../middlewares/logs');

module.exports = function(app){
    app.get('/api/getUserLogs/:username', permissions.getPermissionsByUser, logs.getLogs );
};
