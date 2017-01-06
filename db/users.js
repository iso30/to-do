var query = require('./query.js');

var email = function(email,callback){
    query.GETquery("*","users",["email",email],function(rows){
        callback(rows);
    });
}

var create = function(values,callback){
    query.PUTquery("users",["email","passhash","nickname", "logintype"],values,function(result){
        callback(result);
    });
}

exports.email = email;
exports.create = create;