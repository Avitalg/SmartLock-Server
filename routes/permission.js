var permissions = require('../middlewares/permission');
var physId = require('../helpers/physicalId');

module.exports = function(app){
    app.get('/api/getPermissions', permissions.getPermissions);
    app.get('/api/getPermission/:username/:lockid', permissions.getPermission);
    app.get('/api/getPermissionsByUser/:username', permissions.getPermissionsByUser);
    app.get('/api/getPermissionsByLock/:lockid', permissions.getPermissionsByLock);
    app.get('/api/getLockManager/:lockid', permissions.getLockManager);
    app.post('/api/addPermission', /*permissions.checkIfManager ,*/permissions.addPermission, permissions.sendEmail);
    app.delete('/api/removePermission/:username/:lockid', permissions.removePermission);
    app.delete('/api/removeUserPermissions/:username', permissions.removeUserPermissions);
    app.delete('/api/removeLockPermissions/:lockid', permissions.removeLockPermissions);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4' +
        '/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
    app.put('/api/updatePermission/:username/:lockid/:frequency/:date/:start1/:end1', permissions.updatePermission);
    app.put('/api/changeUserType/:username/:lockid/:type', permissions.changeUserType);
    app.put('/api/updatePhysicalId/:username/:lockid', physId.getPhysicalId, permissions.updatePhysicalId);
};
