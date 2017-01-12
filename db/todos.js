var query = require('./query.js');

var getUndoneByID = function(id,callback){
    query.GETquery("*","todos",["user_id","isdone"],[id,false],function(rows){
        callback(rows);
    });
}

var create = function(values,callback){
    query.PUTquery("todos",["user_id","title","description","isDone"],values,function(result){
        callback(result);
    });
}

var setDone = function(id,callback){
    
    query.UPDATEquery("todos",["isdone"],[true],["id"],[id], function(result){
        callback(result);
    });
}

var deleteByID = function(id,callback){
    query.DELETEquery("todos",["id"],[id],function(result){
        callback(result);
    });
}
exports.create = create;
exports.getUndoneByID = getUndoneByID;
exports.setDone = setDone;
exports.deleteByID = deleteByID;