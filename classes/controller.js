/**
 * The base controller
 */
Controller = Class.extend(
{
   request : null,
   result : null,
   rendered : null,
   noRender : false,
   defaultLayout : 'layout/main',
   forwardData : null,
   
   init : function()
   {
   
   },
   
   initialize : function(request, result)
   {
   	this.request = request;
   	this.result  = result;
   },
   
   setDefaultLayout : function(val)
   {
      this.defaultLayout = val;
   },
   
   setNoRender : function(val)
   {
      if(typeof val == undefined)
      {
         val = true;
      }
      
      this.noRender = val;
   },
   
   render : function (template, options)
   {
      this.result.render(template, options);
      this.rendered = true;
   },
   	
   send : function(content)
   {
      return this.result.send(content);
   },
   
   before_filter : function()
   { 
      return true;
   },
   	
   after_filter : function()
   {
   },
   
   forward : function(action, params, controller)
   {
      this.forwardData = {action: action, controller: controller, params: params};
   },
   	
   action : function(controllerName, actionName, params)
   {
      var controllerClass = require(config.APP_DIR + '/controllers/' + controllerName.toLowerCase() + '.js');
      var controller = new controllerClass.controller();
      controller.initialize(this.request, this.result);
      
      if(actionName == null){ actionName = "index"; }
      
      var action = actionName.dashToCamel() + "Action";
      
      if( controller.before_filter() )
      {
         controller[action]();
         
         if(!controller.rendered && !controller.noRender)
         {
            controller.render(controllerName +  '/' + actionName, {layout: controller.defaultLayout});
         }
         
         controller.rendered = false;
         
         controller.after_filter();
      }
   }
});

/**
 * The base route
 */
Route = function(route, controller, action, params)
{
   this.route = route;
   this.controller = controller;
   this.action = action;
   this.params = params;
};

Route.routes = [];

/**
 * Add a route
 */
exports.addRoute = function(route)
{
   Route.routes.push(route);
};

/**
 * Initialize the router
 */
exports.init = function(app)
{
   var processRoute = function(request, result, controllerFile, action, params)
   {
      var model = require(config.APP_DIR + '/controllers/' + controllerFile);
      var controller = new model.controller();
      controller.initialize(request, result);
      
      if( controller.before_filter() )
      {
         // build action parameter
         if( !action )
         { 
            action = "index"; 
         }
         
         var processAction = action.dashToCamel();
         processAction += 'Action';
         
         if( typeof controller[processAction] == 'function' )
         {
            var processParams = [];
            
            if(typeof params == 'array')
            {
               for(var i in params)
               {
                  processParams.push(request.params[params[i]]);
               };
            }
            
            controller[processAction].apply(controller, processParams);
            
            if(controller.forwardData != null)
            {
               var forwardController, forwardAction, forwardParams;
               
               forwardAction = controller.forwardData.action;
               forwardParams = controller.forwardData.params;
               
               if(!controller.forwardData.controller)
               {
                  forwardController = controllerFile;
               }
               else
               {
                  forwardController = controller.forwardData.controller + ".js";
               }
               
               controller.forwardData = null;
               
               processRoute(request, result, forwardController, forwardAction, forwardParams);
               
               return ;
            }
            
            if(!controller.rendered && !controller.noRender)
            {
               controller.render(controllerFile.substr(0, controllerFile.length - 3) +  '/' + action, {layout: controller.defaultLayout});
            }
            
            controller.rendered = false;
         }
         else
         {
            result.send(processAction + ' is not a controller action');
         }
         
         controller.after_filter();
      }
      
      delete controller;
   };
   
   //Custom routes
   for(var i in Route.routes)
   {
      var route = Route.routes[i];
      
      app.get(route.route, function(request, result)
      {
         return processRoute(request, result, route.controller.toLowerCase() + '.js', route.action, route.params);
      });
   };
   
   //Auto routes
	var fs = require('fs');
   
	// get all js files in controllers subfolder
	fs.readdir(config.APP_DIR + '/controllers', function(err, files)
	{
		files.forEach(function(file)
		{
		   if( /.js$/.test(file) )
		   {
				// add the standard route
				app.get('/' + file.replace(/\.js$/, '') + '/:action?', function(request, result)
				{
				   return processRoute(request, result, file, request.params.action);
				});
		   }
		});
	});
};