var pg = require('pg');
var config = {
  user: process.env.PGUSER, //env var: PGUSER
  database: process.env.PGDATABASE, //env var: PGDATABASE
  password: process.env.PGPASSWORD|| "pgpassword", //env var: PGPASSWORD
  host: process.env.PGIP, // Server hosting the postgres database
  port: process.env.PGPORT, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, //
};

//Pool requests to db
var pool = new pg.Pool(config);

var customQuery = function(query,callback){
  pool.connect(function(err, client, done) {
    if(err){
      return console.error('error fetching client from pool',err);
    }
    client.query(query, function(err,result){
      done();
      if(err){
        return console.error('error running query',err);
      }
      callback(result.rows);
    });
  });
}
var GETquery = function(selectParam,tableParam,whereParam,callback){
    if(whereParam)
        var querystr = 'SELECT '+selectParam+' FROM '+tableParam+' WHERE '+whereParam[0]+"=$1";
    else
        var querystr = 'SELECT '+selectParam+' FROM '+tableParam
    pool.connect(function(err, client, done) {
        if(err){
          return console.error('error fetching client from pool',err);
        }
        client.query(querystr,[whereParam[1]], function(err,result){
          done();
          if(err){
            return console.error('error running query',err);
          }
          callback(result.rows);
        });
    });
}

var PUTquery = function(tableParam,fields,values,callback){
  var querystr = constructPutStr(tableParam,fields,values);
  pool.connect(function(err, client, done) {
    if(err){
      return console.error('error fetching client from pool',err);
    }
    client.query(querystr,values, function(err,result){
      done();
      if(err){
        return console.error('error running query',err);
      }
      callback(result);
    });
  });
}

var constructPutStr = function(tableParam,fields,values){
  var querystr = 'INSERT INTO '+tableParam +'(';
  for(var field in fields){
    querystr += fields[field] + ',';
  }
  querystr = querystr.slice(0,-1);
  querystr += ') VALUES (';
  for(var i = 0; i < values.length; i++){
    querystr += '$' + (i+1).toString()+',';
  }
  querystr = querystr.slice(0,-1);
  querystr += ")";
  
  return querystr;
}
exports.GETquery = GETquery;
exports.PUTquery = PUTquery;
exports.customQuery = customQuery;