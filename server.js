
var http = require('http');
var path = require('path');
var fs = require('fs');

var async = require('async');
var express = require('express');
var session = require('express-session');

var query = require('./db/query.js');

//Use this scheema
var scheema = fs.readFileSync('./db/scheema.sql').toString();
var users = require("./db/users.js");

var bcrypt = require("bcrypt");
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

//Serving static files
router.use(express.static(__dirname + '/views'));
router.use(express.static(__dirname + '/db'));

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
//session middlewear for login
router.use(session({secret:"shhhhhhh",resave:false,saveUninitialized:false}));

//Set homepage
router.get("/",function(req,res){
  if(req.session.email)
    return res.redirect("/to-dos")
  else
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
          return console.error("error hashing password", err);
        }
        users.create([req.body.email,hash,req.body.nickname],function(result){
           res.send({unique:true,redirect:"/"});
        });
      });
    }
  });
});

router.post("/login",function(req, res) {
  users.email(req.body.email,function(rows){
    if(!rows[0]){
      res.send({authorized:false});
    }
    else{
      bcrypt.compare(req.body.password,rows[0].passhash,function(err,bres){
        if(err){
          return console.error("Error checking password",err);
        }
        if(bres){
          req.session.email = req.body.email;
          req.session.nickname = rows[0].nickname;
          res.send({authorized:true,redirect:"/to-dos"})
        }
        else{
          res.send({authorized:false})
        }
      });      
    }
  });
});

router.get("/to-dos", function(req,res){
  res.sendfile("./views/to-dos.html");
});

router.get("/getUserInfo",function(req, res) {
  if(!req.session.email){
    res.statusCode = 404;
    res.end()
  }
  else{
    return res.json({nickname:req.session.nickname});
  }
});
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log(("Connected"));
  query.customQuery(scheema,function(){
    
  });
});
