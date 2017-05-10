var users = require('../middlewares/user');
var permissions = require('../middlewares/permission');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:username', users.getUser);
    app.post('/api/addUser', users.addUser);
    app.delete('/api/removeUser/:username', permissions.removeUserPermissions, users.removeUser);
    app.put('/api/updateUser/:username/:nusername/:phone', users.updateUser, permissions.changePermissionUsername);
    app.put('/api/changePassword/:username/:password', users.changePassword);

};
