var users = require('../middlewares/user');
var permissions = require('../middlewares/permission');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser', users.getUser);
    app.get('/api/getUsersByLock/:lockid', permissions.getPermissionsByLock, users.getUsersByLock);
    app.post('/api/addUser', users.addUser);
    app.post('/api/addUserPhoto', users.addUserPhoto);
    app.post('/api/login', users.login)
    app.delete('/api/removeUser/:username', permissions.removeUserPermissions, users.removeUser);
    app.put('/api/updateUser/:username/:nusername/:phone', users.updateUser, permissions.changePermissionUsername);
    app.put('/api/changePassword/:username/:password', users.changePassword);

};
