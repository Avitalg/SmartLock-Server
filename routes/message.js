/**
 * Created by avitalg on 4/4/2017.
 */
var message = require('../controllers/message');

module.exports = function(app) {
    app.all('/api/home', message.helloMessage);
    app.all('/api/*', message.errorMessage);
    app.all('/*', message.errorMessageAll);
};