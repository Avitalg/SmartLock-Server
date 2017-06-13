var users = require('../middlewares/user');
var permissions = require('../middlewares/permission');
var locks = require('../middlewares/lock');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:username', users.getUser);
    app.get('/api/isLoggedIn', users.isLoggedIn);
    app.get('/api/getLoggedInUser', users.getLoggedInUser);
    app.get('/api/getUsersByLock/:lockid', permissions.getPermissionsByLock, users.getUsersByLock);
    app.post('/api/addUser', users.addUser);
    app.post('/api/addUserPhoto', users.addUserPhoto);
    app.post('/api/login', users.login, locks.getLocksByUser);
    app.post('/api/openManagerAccount', permissions.checkIfHasManager, permissions.addManagerPermission, users.addUser);
    app.delete('/api/removeUser/:username', permissions.removeUserPermissions, users.removeUser);
    app.put('/api/updateUser/:username/:nusername/:phone', users.updateUser, permissions.changePermissionUsername);
    app.put('/api/changePassword/:username/:password', users.changePassword);
};
