# SmartLock-Server

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOCK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getLocks', locks.getLocks);
app.get('/api/getLock/:lockid', locks.getLock);
app.get('/api/addLock/:lockid/:lstatus', locks.addLock);
app.get('/api/removeLock/:lockid', locks.removeLock);
app.get('/api/updateLockStatus/:lockid/:lstatus', locks.updateLockStatus);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PERMISSION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getPermissions', permissions.getPermissions);
app.get('/api/getPermission/:userid/:lockid', permissions.getPermission);
app.get('/api/addPermission/:userid/:lockid/:physicalId/:frequency/:duration1/:duration2/:duration3/:duration4/:duration5/:duration6/:duration7', permissions.addPermission);/**/
app.get('/api/removePermission/:userid/:lockid/', permissions.removePermission);
app.get('/api/updatePermission/:userid/:lockid/:physicalId/:frequency/:duration1/:duration2/:duration3/:duration4/:duration5/:duration6/:duration7', permissions.updatePermission);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~USER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/api/getUsers', users.getUsers);
app.get('/api/getUser/:userid', users.getUser);
app.get('/api/removeUser/:userid', users.removeUser);
app.get('/api/addUser/:username/:phone/:password', users.addUser);
app.get('/api/updateUser/:username/:phone/:password', users.updateUser);
app.all('/api/*', users.errorMessage);
