var locks = require('../middlewares/lock');
var permissions = require('../middlewares/permission');

module.exports = function(app) {
    app.get('/api/getLocks', locks.getLocks);
    app.get('/api/getLock/:lockid', locks.getLock);
    app.get('/api/getLocksByUser', locks.getLocksByUser);
    app.get('/api/getManageLocksByIds', permissions.getManagerLocks, locks.getLocksById);
    app.post('/api/addLock', locks.addLock);
    app.delete('/api/removeLock/:lockid', permissions.checkManagerPermissions, permissions.removeLockPermissions, locks.removeLock);
    app.put('/api/updateLockStatus/:lockid/:lstatus', permissions.checkPermission, locks.updateLockStatus);
};