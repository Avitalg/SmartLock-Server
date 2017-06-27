# SmartLock-Server

## LOCK

https://smartlockproject.herokuapp.com/api/getLocks?token=xxx
    Method : GET  
    Query : token from login

https://smartlockproject.herokuapp.com/api/getLock/lockid?token=xxx
    Method : GET  
    Params : lockid
    Query : token from login

https://smartlockproject.herokuapp.com/api/getLocksByUser?token=xxx
    Method : GET
    Params : username
     Query : token from login

https://smartlockproject.herokuapp.comapi/addLock?token=xxx
    Method : POST  
    Params : lockid & lstatus (lock status)  
            &desc (description of the lock)
    Query : token from login

https://smartlockproject.herokuapp.com/api/removeLock/lockid?token=xxx
    Method : DELETE  
    Params : lockid
    Query : token from login

https://smartlockproject.herokuapp.com/api/updateLockStatus/lockid/lstatus?token=xxx
   Method : PUT  
   Params : lockid & lstatus (lock status)
   Query  : login token


## PERMISSION

https://smartlockproject.herokuapp.com/api/getPermissions?token=xxx
    Method : GET
    Query  : login token

https://smartlockproject.herokuapp.com/api/getPermission/lockid?token=xxx
    Method : GET  
    params : userid & lockid
    Query  : login token

https://smartlockproject.herokuapp.com/api/getPermissionsByUser?token=xxx
    Method : GET   
    params : username
    Query  : login token

https://smartlockproject.herokuapp.com/api/getPermissionsByLock/lockid?token=xxx
    Method : GET  
    params : lockid
    Query  : login token


https://smartlockproject.herokuapp.com/api/addPermission?token=xxx
    Method : POST  
    params : username & lockid
            frequency (always/once)
            type (0- manager, 1-user with physical id 2- user without physical id)
            start1,start2,...,start7 - start1 is the hour of the starting permission in day 1.  
            end1, end2,....,end7 - end1 us the hour od the ending permission in day 1.  
            example:  
            start1=10:00, end1=17:00 -> on Sunday he will get permission from 10 to 5 PM.  
            date - if frequency is once - you can enter the date and only start1 + end1.  
    Query  : login token


https://smartlockproject.herokuapp.com/api/removePermission/username/lockid?token=xxx
    Method : DELETE  
    params : username & lockid
    Query  : login token


https://smartlockproject.herokuapp.com/api/removeUserPermissions/username?token=xxx
    Method : DELETE
    params : username
    Query  : login token

https://smartlockproject.herokuapp.com/api/removeLockPermissions/lockid?token=xxx
    Method : DELETE
    params : lockid
    Query  : login token

https://smartlockproject.herokuapp.com/api/updatePermission/username/lockid/frequency/type/start1/end1/start2/end2/start3/end3/start4/end4/start5/end5/start6/end6/start7/end7
    ?token=xxx
    Method : PUT
    params: username & lockid & frequency & start1-7 & end1-7
    Query  : login token

https://smartlockproject.herokuapp.com/api/updatePermission/username/lockid/frequency/type/date/start1/end1
    ?token=xxx
    Method : PUT
    params: userid & lockid & frequency & type & start1 & end1
            & date (format: YYYY-MM-DD)
    Query  : login token

https://smartlockproject.herokuapp.com/api/changeUserType/username/lockid/type?token=xxx
    Method : PUT
    params: username & lockid &
            type (0- manager, 1-user with physical id 2- user without physical id)
    Query  : login token

https://smartlockproject.herokuapp.com/api/updatePhysicalId/lockid?token=xxx
    Method : PUT
    params:  lockid
    Query  : login token

## USER

https://smartlockproject.herokuapp.com/api/getUsers?token=xxx
    Method : GET  

https://smartlockproject.herokuapp.com/api/getUser/username?token=xxx
    Method : GET  
    params : userid  
    Query  : login token

https://smartlockproject.herokuapp.com/api/getUsersByLock/lockid?token=xxx
    Method : GET  
    params : lockid
    Query  : login token

https://smartlockproject.herokuapp.com/api/removeUser/username?token=xxx
    Method : DELETE  
    params : username
    Query  : login token

https://smartlockproject.herokuapp.com/api/addUser 
    Method : POST  
    params : username & phone & password  

https://smartlockproject.herokuapp.com/api/addUserPhoto?token=xxx
    Method : POST   
    params : image(url)
    Query  : login token

https://smartlockproject.herokuapp.com/api/login  
    Method : POST   
    params : username & password   

https://smartlockproject.herokuapp.com/api/updateUser/username/phone?token=xxx
    Method : PUT  
    params : username(new username) & phone
    Query  : login token

https://smartlockproject.herokuapp.com/api/changePassword/password?token=xxx
    Method : PUT  
    params : password
    Query  : login token


## LOGS
https://smartlockproject.herokuapp.com/api/getUserLogs?token=xxx
    Method : GET
    Query  : login token