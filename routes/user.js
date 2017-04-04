var users = require('../controllers/user');

module.exports = function(app){
    app.get('/api/getUsers', users.getUsers);
    app.get('/api/getUser/:userid', users.getUser);
    app.get('/api/addUser/:username/:phone/:password', users.addUser);
    app.get('/api/removeUser/:userid', users.removeUser);
    app.get('/api/updateUser/:userid/:username/:phone/:password', users.updateUser);
};
