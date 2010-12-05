module.exports = require('../base_controller').extend({
	indexAction : function() {
		this.render('index', {
			locals: {
				title: 'Express'
			}
		});
	},
	testAction : function() {
		this.send('test');
	}
});
