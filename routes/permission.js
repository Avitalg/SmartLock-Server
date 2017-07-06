var permissions = require('../middlewares/permission');
var logs = require('../middlewares/logs');

module.exports = function(app){
    app.get('/api/getPermissions', permissions.getPermissions);
    app.get('/api/getPermission/:username/:lockid', permissions.getPermission);
    app.get('/api/getPermissionsByUser', permissions.getPermissionsByUser);
    app.get('/api/getPermissionsByLock/:lockid', permissions.checkManagerPermissions, permissions.getPermissionsByLock);
    app.get('/api/getLockManagers/:lockid',permissions.checkManagerPermissions, permissions.getLockManagers);
    app.post('/api/addPermission', permissions.checkIfHasManager, permissions.checkManagerPermissions ,permissions.addPermission, permissions.sendEmail);
    app.delete('/api/removePermission/:username/:lockid',permissions.checkManagerPermissions, permissions.removePermission, logs.deleteLogs);
    app.delete('/api/removeUserPermissions/:username', permissions.removeUserPermissions);
    app.delete('/api/removeLockPermissions/:lockid', permissions.removeLockPermissions);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4' +
        '/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:date/:start1/:end1', permissions.updatePermission);
    app.put('/api/changeUserType/:username/:lockid/:type', permissions.changeUserType);
    app.put('/api/updatePhysicalId/:lockid', permissions.getPhysicalId, permissions.updatePhysicalId);
};
