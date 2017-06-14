var locks = require('../middlewares/lock');
var permissions = require('../middlewares/permission');

module.exports = function(app) {
    app.get('/api/getLocks', locks.getLocks);
    app.get('/api/getLock/:lockid', locks.getLock);
    app.get('/api/getLocksByUser/:username', locks.getLocksByUser);
    app.get('/api/getManageLocksByIds/:username', permissions.getUserManageLocks, locks.getLocksByIds);
    app.post('/api/addLock', locks.addLock);
    app.delete('/api/removeLock/:lockid', permissions.removeLockPermissions, locks.removeLock);
    app.put('/api/updateLockStatus/:username/:lockid/:lstatus', permissions.checkPermission, locks.updateLockStatus);
};