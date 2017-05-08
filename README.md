# SmartLock-Server

## LOCK

https://smartlockproject.herokuapp.com/api/getLocks  
    Method : GET  

https://smartlockproject.herokuapp.com/api/getLock/:lockid  
    Method : GET  
    Params : lockid  

https://smartlockproject.herokuapp.com/api/getLocksByUser/:username  
    Method : GET  
    Params : username   

https://smartlockproject.herokuapp.comapi/addLock  
    Method : POST  
    Params : lockid & lstatus (lock status)  

https://smartlockproject.herokuapp.com/api/removeLock/:lockid  
    Method : DELETE  
    Params : lockid  

https://smartlockproject.herokuapp.com/api/updateLockStatus/:username/:lockid/:lstatus  
   Method : PUT  
   Params : username & lockid & lstatus (lock status)  


## PERMISSION

https://smartlockproject.herokuapp.com/api/getPermissions  
    Method : GET  

https://smartlockproject.herokuapp.com/api/getPermission/:userid/:lockid  
    Method : GET  
    params : userid & lockid  

https://smartlockproject.herokuapp.com/api/getPermissionsByUser/:username    
    Method : GET   
    params : username   

https://smartlockproject.herokuapp.com/api/getPermissionsByLock/:lockid   
    Method : GET  
    params : lockid  

https://smartlockproject.herokuapp.com/api/getLockManager/:lockid   
    Method : GET  
    params : lockid  

https://smartlockproject.herokuapp.com/api/addPermission  
    Method : POST  
    params : userid & lockid  
            frequency (always/once)
            type (0- manager, 1-user with physical id 2- user without physical id)
            start1,start2,...,start7 - start1 is the hour of the starting permission in day 1.  
            end1, end2,....,end7 - end1 us the hour od the ending permission in day 1.  
            example:  
            start1=10:00, end1=17:00 -> on Sunday he will get permission from 10 to 5 PM.  
            date - if frequency is once - you can enter the date and only start1 + end1.  



https://smartlockproject.herokuapp.com/api/removePermission/:userid/:lockid/  
    Method : DELETE  
    params : userid & lockid  

https://smartlockproject.herokuapp.com/api/updatePermission/:userid/:lockid/:frequency/:start1/:end1/:start2/:end2/:start3/:end3/:start4/:end4/:start5/:end5/:start6/:end6/:start7/:end7  
    Method : PUT  
    params: userid & lockid & frequency & start1-7 & end1-7  

https://smartlockproject.herokuapp.com/api/updatePermission/:userid/:lockid/:frequency/:date/:start1/:end1  
    Method : PUT  
    params: userid & lockid & frequency & start1 & end1
            & date (format: YYYY-MM-DD)

https://smartlockproject.herokuapp.com/api/changeUserType/:userid/:lockid/:type
    Method : PUT
    params: userid & lockid &
            type (0- manager, 1-user with physical id 2- user without physical id)

https://smartlockproject.herokuapp.com/api/updatePhysicalId/:username/:lockid
    Method : PUT
    params: username & lockid 

## USER

https://smartlockproject.herokuapp.com/api/getUsers 
    Method : GET  

https://smartlockproject.herokuapp.com/api/getUser/:userid 
    Method : GET  
    params : userid  

https://smartlockproject.herokuapp.com/api/removeUser/:username 
    Method : DELETE  
    params : username  

https://smartlockproject.herokuapp.com/api/addUser 
    Method : POST  
    params : username & phone & password  

https://smartlockproject.herokuapp.com/api/updateUser/:username/:nusername/:phone 
    Method : PUT  
    params : username & nusername (new username) & phone  

https://smartlockproject.herokuapp.com/api/changePassword/:username/:password 
    Method : PUT  
    params : username & password     


