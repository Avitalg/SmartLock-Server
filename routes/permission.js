var permissions = require('../middlewares/permission');
var physId = require('../helpers/physicalId');

module.exports = function(app){
    app.get('/api/getPermissions', permissions.getPermissions);
    app.get('/api/getPermission/:lockid', permissions.getPermission);
    app.get('/api/getPermissionsByUser', permissions.getPermissionsByUser);
    app.get('/api/getPermissionsByLock/:lockid', permissions.getPermissionsByLock);
    app.get('/api/getLockManager/:lockid', permissions.getLockManager);
    app.post('/api/addPermission', permissions.checkIfHasManager ,permissions.addPermission, permissions.sendEmail);
    app.delete('/api/removePermission/:username/:lockid',permissions.checkIfManager, permissions.removePermission);
    app.delete('/api/removeUserPermissions/:username',permissions.checkIfManager, permissions.removeUserPermissions);
    app.delete('/api/removeLockPermissions/:lockid',permissions.checkIfManager, permissions.removeLockPermissions);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4' +
        '/:start5/:end5/:start6/:end6/:start7/:end7',permissions.checkIfManager, permissions.updatePermission);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:type/:date/:start1/:end1',permissions.checkIfManager, permissions.updatePermission);
    app.put('/api/changeUserType/:username/:lockid/:type',permissions.checkIfManager, permissions.changeUserType);
    app.put('/api/updatePhysicalId/:lockid', physId.getPhysicalId);
    app.get('/api/getUserLogs', permissions.getPermissionsByUser, permissions.getUserLogs );
};
