/*
The MIT License

Copyright (c) 2010 Roman Weinberger <rw@roman-weinberger.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
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