var users = require('../middlewares/user');
var permissions = require('../middlewares/permission');
var locks = require('../middlewares/lock');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser', users.getUser);
    app.get('/api/getUsersByLock/:lockid', permissions.getPermissionsByLock, users.getUsersByLock);
    app.post('/api/addUserPhoto', users.addUserPhoto);
    app.delete('/api/removeUser', permissions.removeUserPermissions, users.removeUser);
    app.put('/api/updateUser/:username/:phone', users.updateUser, permissions.changePermissionUsername);
    app.put('/api/changePassword/:password/:oldpass', users.changePassword);
    app.post('/api/sendMemberMessage', users.sendMemberMessage, permissions.sendEmail)
};
