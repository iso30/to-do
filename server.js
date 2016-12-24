//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var viewPath = "./views/"

router.get("/",function(req,res){
  res.sendfile(viewPath + "index.html")
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log(("Connected"))
});
