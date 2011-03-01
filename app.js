//Require
var express = require('express');
    require('./classes/core.js');
    require('./classes/util.js');
    config = require('./config.js');
    controller = require('./classes/controller.js');
    require('./bootstrap.js');

//Initialisation
var app = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieDecoder());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var bootstrap = new Bootstrap(app);
for(var i in bootstrap)
{
   if(typeof bootstrap[i] == "function")
   {
      bootstrap[i]();
   }
};

//Listen
app.listen(8080);

