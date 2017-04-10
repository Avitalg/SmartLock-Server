var permissions = require('../controllers/permission');

module.exports = function(app){
    app.get('/api/getPermissions', permissions.getPermissions);
    app.get('/api/getPermission/:userid/:lockid', permissions.getPermission);
    app.post('/api/addPermission', permissions.addPermission);
    app.delete('/api/removePermission/:userid/:lockid/', permissions.removePermission);
    app.put('/api/updatePermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
    app.put('/api/updatePermission/:userid/:lockid/:frequency/:date/:start1/:end1', permissions.updatePermission);
    app.put('/api/updatePhysicalId/:userid/:lockid/:physicalId', permissions.updatePhysicalId);
};
