var permissions = require('../controllers/permission');

module.exports = function(app){
    app.get('/api/getPermissions', permissions.getPermissions);
    app.get('/api/getPermission/:userid/:lockid', permissions.getPermission);
    app.get('/api/addPermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7', permissions.addPermission);
    app.get('/api/removePermission/:userid/:lockid/', permissions.removePermission);
    app.get('/api/updatePermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7', permissions.updatePermission);
    app.get('/api/updatePhysicalId/:userid/:lockid/:physicalId', permissions.updatePhysicalId);
};
