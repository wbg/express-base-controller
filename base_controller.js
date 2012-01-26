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
BaseController = function(request, response) {
	this.request = request;
	this.response  = response;
	
	this.render = function(template, options) {
		return this.response.render(template, options);
	};
	
	this.send = function(content) {
		return this.response.send(content);
	};
	
	this.extend = function(child) {
	    for(var p in child) this[p] = child[p];
		return this;
	};
	
	this.before_filter = function() { return true; };
	
	this.after_filter = function() { };
};

// really simple routing
exports.init_routes = function(app) {
   
	var fs = require('fs');
	
	// Convert dash to camel string (by James Roberts)
	// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	dashToCamel = function(str) {
		return str.replace(/(\-[a-z])/g, function($1) { return $1.toUpperCase().replace('-',''); });
	};
   
	// get all js files in controllers subfolder
	fs.readdir(__dirname+'/controllers', function(err, files) {
		files.forEach(function(file) {

			if( /.js$/.test(file) ) {
			   
				// add the standard route
				app.get('/' + file.replace(/\.js$/, '') + '/:action?/:id?', function(request, response) {
				   var mdl = require('./controllers/'+file);
					var controller = new mdl.controller(request, response);
					if( controller.before_filter() ) {
						// build action parameter
						if( !request.params.action ) { 
							request.params.action = "indexAction"; 
						} else {
						   request.params.action = dashToCamel(request.params.action);
							request.params.action += 'Action';
						}
						// try to call the action
						if( typeof controller[request.params.action] == 'function' ) {
							controller[request.params.action]();
						} else {
							response.send(request.params.action + ' is not a controller action');
						}
						controller.after_filter();
					}
					delete controller;
				});
			}

		});
	});
};