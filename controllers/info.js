var Info = Controller.extend(
{
   indexAction : function()
   {
      this.forward("moto");
   },
   
   motoAction : function()
   {
   },
   
   carAction : function()
   {
      this.render("car/custom", {layout: this.defaultLayout})
   }
});

exports.controller = Info;