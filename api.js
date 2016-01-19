var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');

module.exports = function(wagner){
	
	var api = express.Router();

	api.use(bodyparser.json());

	api.get('/user/:user', function(req,res){
		res.send('Landed at page for User: ' + req.params.user + 
		' with option : ' + req.query.option);
	});

	api.get('/category/id/:id', wagner.invoke(function(Category){
		return function(req, res){
			Category.findOne({_id : req.params.id},
				handleOne.bind(null, 'category', res));
		};	
	}));

	api.get('/category/parent/:id', wagner.invoke(function(Category){
		return function(req, res){
			Category.
				find({ parent : req.params.id }).
				sort({ _id : 1 }).
				exec(handleMany.bind(null, 'categories', res));
		};
	}));

	api.get('/product/id/:id', wagner.invoke(function(Product){
		return function(req, res){
			Product.findOne({ _id: req.params.id }, 
				handleOne.bind(null, 'product', res));
		};
	}));

	api.get('/product/category/:id', wagner.invoke(function(Product){
		return function(req, res){
			var sort = { name : 1 };
			if(req.query.price === "1"){
				sort = { 'internal.approximatePriceUSD' : 1 };
			}else if (req.query.price === "-1"){
				sort = { 'internal.approximatePriceUSD' : - 1 }
			}
			Product.
				find({ 'category.ancestors' : req.params.id }).
				sort(sort).
				exec(handleMany.bind(null, 'products', res));
		};
	}));

	api.put('/me/cart', wagner.invoke(function(User){
		return function(req, res){
			try{
				var cart = req.body.data.cart;
			}catch(e){
				return res.
				status(status.BAD_REQUEST).
				json({ error : "Cart not provided"});
			}

			req.user.data.cart = cart;
			req.user.save(function(err, user){
				if(err){
					return res.
					status(status.INTERNAL_SERVER_ERROR).
					json({ error : err.toString() });
				}
				res.json({ user : user });
			})
		}
	}));

	api.get('/me', function(req, res){
		if(!req.user){
			return res.
			status(status.UNAUTHORIZED).
			json({ error : "User not logged in"});
		}
		req.user.populate('data.cart.product', handleOne(null, 'user', res));
	});

	return api;
};

function handleOne(property, res, err, doc){
	if(err){
		return res.
		status(status.INTERNAL_SERVER_ERROR).
		json({ error : err.toString()});					
	}
	if(!doc){
		return res.
		status(status.NOT_FOUND).
		json({ error : "Resource not found"});
	}
	var response = {};
	response[property] = doc;
	res.json(response);
}

function handleMany(property, res, err, docs){
	if(err){
		return res.
		status(status.INTERNAL_SERVER_ERROR).
		json({ error : err.toString()});					
	}
	var response = {};
	response[property] = docs;
	res.json(response);
}