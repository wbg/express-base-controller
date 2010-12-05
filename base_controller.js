module.exports = {
	init : function(request, result) {
		this.request = request;
		this.result  = result;
	},
	init_routes : function(app) {
		var fs = require('fs');
		
		fs.readdir(__dirname+'/controllers', function(err, files) {
			files.forEach(function(file) {
				app.get('/' + file.replace(/\.js$/, '') + '/:action?/:id?', function(request, result) {
					var controller = require('./controllers/'+file);
					controller.init(request, result);
					if( controller.before_filter() ) {
						// build action parameter
						if( !request.params.action ) { 
							request.params.action = "indexAction"; 
						} else {
							request.params.action += 'Action';
						}
						// try to call the action
						if( typeof controller[request.params.action] == 'function' ) {
							controller[request.params.action]();
						} else {
							result.send(request.params.action + ' is not a controller action');
						}
						controller.after_filter();
					}
				});
			});
		});
	},
	render : function(template, options) {
		return this.result.render(template, options);
	},
	send : function(content) {
		return this.result.send(content);
	},
	extend : function(child) {
	    for(var p in child) this[p] = child[p];
		return this;
	},
	before_filter : function() { return true; },
	after_filter : function() { }
}