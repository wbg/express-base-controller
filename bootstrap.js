Bootstrap = function(app)
{
   this.app = app;
   
   this.initRoutes = function()
   {
      //Index route
      var indexRoute = new Route("/", "index", "index");
      controller.addRoute(indexRoute);
      
      //Initialize routes
      controller.init(this.app);
   };
};