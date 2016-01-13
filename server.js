var express = require('express');

module.exports = function(){
	var app = express();

	app.use('/api/v1', require('./api.js')());

	return app;
}
