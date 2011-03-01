/**
 * Like jQuery proxy
 */
Function.prototype.bind = function(obj) {
  var method = this,
   temp = function() {
    return method.apply(obj, arguments);
   };
 
  return temp;
};

/**
 * DashToCamel
 */
String.prototype.dashToCamel = function()
{
   var str = this;
   return str.replace(/(\-[a-z])/g, function(str){return str.toUpperCase().replace('-','');});
};


/**
 * UnderscoreToCamel
 */
String.prototype.underscoreToCamel = function()
{
   var str = this;
   return str.replace(/(\_[a-z])/g, function(str){return str.toUpperCase().replace('_','');});
};