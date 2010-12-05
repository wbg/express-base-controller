var ExampleController = function(request, result) {
	BaseController.call(this, request, result);
	
	this.y = 0;
	
	this.indexAction = function() {
		this.render('index', {
			locals: {
				title: 'Express'
			}
		});
	};
	
	this.testAction = function() {
		this.y += 1;
		this.send(this.y+'');
	};
};

exports.controller = ExampleController;