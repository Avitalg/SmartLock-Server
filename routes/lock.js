var locks = require('../middlewares/lock');
var permissions = require('../middlewares/permission');

module.exports = function(app) {
    app.get('/api/getLocks', locks.getLocks);
    app.get('/api/getLock/:lockid', locks.getLock);
    app.get('/api/getLocksByUser/:username', locks.getLocksByUser);
    app.post('/api/addLock', locks.addLock);
    app.delete('/api/removeLock/:lockid', locks.removeLock);
    app.put('/api/updateLockStatus/:userid/:lockid/:lstatus', permissions.checkPermission, locks.updateLockStatus);
};