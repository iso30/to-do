
var http = require('http');
var path = require('path');
var fs = require('fs');

var async = require('async');
var express = require('express');

//db config
var pg = require('pg');
var config = {
  user: process.env.PGUSER, //env var: PGUSER
  database: process.env.DATABASE_URL, //env var: PGDATABASE
  password: process.env.PGPASSWORD, //env var: PGPASSWORD
  host: process.env.IP, // Server hosting the postgres database
  port: process.env.PGPORT, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, //
};
var pool = new pg.Pool(config);
var scheema = fs.readFileSync('./db/scheema.sql').toString();
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

router.use(express.static(__dirname + '/views'));
router.use(express.static(__dirname + '/db'))

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
router.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());

router.get("/",function(req,res){
  res.sendfile("/views/index.html")
});

router.post("/",function(req,res){
  pool.connect(function(err,client,done){
    if(err){
      return console.error('error fetching client from pool',err);
    }
    client.query('INSERT INTO tab (name) VALUES($1)',[req.body.name],function(err,result){
      done();
      if(err){
        return console.error('error running query',err);
      }
    });
  });
  pool.on('error',function(err,client){
    console.error('ide client error', err.message, err.stack);
  })
  res.redirect("/")
});

router.get("/list", function(req,res){
  pool.connect(function(err, client, done) {
      if(err){
        return console.error("error fetching client from pool",err);
      }
      client.query('SELECT * FROM tab',function(err,result){
        done();
        res.json(result.rows);
      })
  });
  pool.on('error',function(err,client){
    console.error('idle client error', err.message,err.stack);
  })
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log(("Connected"))
  pool.connect(function(err,client,done){
    if(err){
      return console.error('error fetching client from pool',err);
    }
    client.query(scheema,function(err,result){
      done();
      
      if(err){
        return console.error('error running query',err);
      }
    });
    pool.on('error',function(err,client){
      console.error('idle client error',err.message,err.stack);
    })
  })
});
