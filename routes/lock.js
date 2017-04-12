var locks = require('../middlewares/lock');

module.exports = function(app) {
    app.get('/api/getLocks', locks.getLocks);
    app.get('/api/getLock/:lockid', locks.getLock);
    app.post('/api/addLock', locks.addLock);
    app.delete('/api/removeLock/:lockid', locks.removeLock);
    app.put('/api/updateLockStatus/:lockid/:lstatus', locks.updateLockStatus);
};