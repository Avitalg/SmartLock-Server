var users = require('../middlewares/user');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:userid', users.getUser);
    app.post('/api/addUser', users.addUser);
    app.delete('/api/removeUser/:userid', users.removeUser);
    app.put('/api/updateUser/:userid/:username/:phone/:password', users.updateUser);
};
