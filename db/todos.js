var query = require('./query.js');

var getByID = function(id,callback){
    query.GETquery("*","todos",["user_id",id],function(rows){
        callback(rows);
    });
}

var create = function(values,callback){
    query.PUTquery("todos",["user_id","title","description","isDone"],values,function(result){
        callback(result);
    });
}

exports.create = create;
exports.getByID = getByID;