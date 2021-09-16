const basicAuth = require('express-basic-auth');
const User = require('../models/User.model');

function myCustomAuthorizer(username, password){
    
    const users = User.findALL().filter(u => u.Email === username);
    if (users.length <=0) return false;
 
    const userMatches = basicAuth.safeCompare(username, users[0].Email);
    const passwordMatches = basicAuth.safeCompare(password, users[0].Pass.toString());

    return userMatches && passwordMatches
}

module.exports = myCustomAuthorizer;