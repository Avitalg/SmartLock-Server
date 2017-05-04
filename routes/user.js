var users = require('../middlewares/user');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:username', users.getUser);
    app.post('/api/addUser', users.addUser);
    app.delete('/api/removeUser/:userid', users.removeUser);
    app.put('/api/updateUser/:username/:nusername/:phone', users.updateUser);
    app.put('/api/changePassword/:username/:password', users.changePassword);

};
