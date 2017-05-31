/**
 * Created by Nir Shchori on 28/04/2017.
 */
var lockRequest = require('../middlewares/lockRequest');
var permissions = require('../middlewares/permission');
var helpers = require('../helpers/physicalId')

module.exports = function(app) {
    app.post('/api/requestLockAction/:action',permissions.rightPermission, helpers.fingerprintActions, lockRequest.requestLockAction);
    app.get('/api/checkLockAction/:requestId',lockRequest.checkLockAction);
    app.get('/api/lockRequest/:lockId',lockRequest.checkLockRequest);
    app.post('/api/lockRequest/:lockId',lockRequest.updateLockRequest);
};