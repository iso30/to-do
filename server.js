
var http = require('http');
var path = require('path');
var fs = require('fs');

var async = require('async');
var express = require('express');

var query = require('./db/query.js');

//Use this scheema
var scheema = fs.readFileSync('./db/scheema.sql').toString();
var users = require("./db/users.js")

var bcrypt = require("bcrypt");
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

//Serving static files
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

//Set homepage
router.get("/",function(req,res){
  res.sendfile("./views/login.html");
});

router.get("/signup", function(req, res) {
   res.sendfile("./views/signup.html"); 
});

router.post("/signup",function(req,res){
  users.email(req.body.email,function(rows){
    if(rows[0])
      res.send({unique:false});
    else{
      bcrypt.hash(req.body.password.toString(), 5, function(err, hash) {
        if(err){
          return console.error("error hashing password", err)
        }
        users.create([req.body.email,hash,req.body.nickname],function(result){
           res.send({unique:true,redirect:"/"});
        });
      });
    }
  });
});

router.post("/login",function(req, res) {
    
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
  res.redirect("/");
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
  query.customQuery(scheema,function(){
    
  })
});
