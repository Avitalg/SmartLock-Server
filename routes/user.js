var users = require('../middlewares/user');
var permissions = require('../middlewares/permission');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:username', users.getUser);
    app.get('/api/getUsersByLock/:lockid', permissions.getPermissionsByLock, users.getUsersByLock);
    app.post('/api/addUser', users.addUser);
    app.post('/api/addUserPhoto', users.addUserPhoto);
    app.delete('/api/removeUser/:username', permissions.removeUserPermissions, users.removeUser);
    app.put('/api/updateUser/:username/:nusername/:phone', users.updateUser, permissions.changePermissionUsername);
    app.put('/api/changePassword/:username/:password', users.changePassword);

};
