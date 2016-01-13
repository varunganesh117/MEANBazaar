var express = require('express');

module.exports = function(){
	
	var api = express.Router();

	api.get('/user/:user', function(req,res){
		res.send('Landed at page for User: ' + req.params.user + 
		' with option : ' + req.query.option);
	});

	return api;
}
