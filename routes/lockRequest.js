/**
 * Created by I325775 on 28/04/2017.
 */
var lockRequest = require('../middlewares/lockRequest');
var permissions = require('../middlewares/permission');

module.exports = function(app) {
    app.post('/api/requestLockAction/:action',permissions.checkPermission, lockRequest.requestLockAction);
    app.get('/api/checkLockAction/:requestId',lockRequest.checkLockAction);
    app.get('/api/lockRequest/:lockId',lockRequest.checkLockRequest);
    app.post('/api/lockRequest/:lockId',lockRequest.updateLockRequest);
};