var express = require('express');
var status = require('http-status');

module.exports = function(wagner){
	
	var api = express.Router();

	api.get('/user/:user', function(req,res){
		res.send('Landed at page for User: ' + req.params.user + 
		' with option : ' + req.query.option);
	});

	api.get('/category/id/:id', wagner.invoke(function(Category){
		return function(req, res){
			Category.findOne({_id : req.params.id}, function(err, category){
				if(err){
					res.status(status.INTERNAL_SERVER_ERROR).
					json({ error : err.toString()});
				}
				if(!category){
					res.status(status.NOT_FOUND).
					json({ error : "Resource not found"});
				}
				res.json({ category : category });
			});
		};	
	}));

	api.get('/category/parent/:id', wagner.invoke(function(Category){
		return function(req, res){
			Category.
				find({ parent : req.params.id }).
				sort({ _id : 1 }).
				exec(function(err, categories){
					if(err){
						res.status(status.INTERNAL_SERVER_ERROR).
						json({ error : err.toString()});					
					}
					res.json({categories : categories});
				});
		}
	}));

	return api;
}
