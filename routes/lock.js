var locks = require('../controllers/lock');

module.exports = function(app) {
    app.get('/api/getLocks', locks.getLocks);
    app.get('/api/getLock/:lockid', locks.getLock);
    app.get('/api/addLock/:lockid/:lstatus', locks.addLock);
    app.get('/api/removeLock/:lockid', locks.removeLock);
    app.get('/api/updateLockStatus/:lockid/:lstatus', locks.updateLockStatus);
};