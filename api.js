var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');
var _ = require('underscore');

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

	api.get('/product/text/:query', wagner.invoke(function(Product){
		return function(req, res){
			Product.find({
				'$text' : { '$search' : req.params.query }
			},
			{
				score : { '$meta' : 'textScore' }
			}).
			sort({ score : { '$meta' : 'textScore' } }).
			exec(handleMany.bind(null, 'products', res));
		}
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

	api.post('/checkout', wagner.invoke(function(User, Stripe){
		return function(req, res){
			if(!req.user){
				return res.
				status(status.UNAUTHORIZED).
				json({ error : "User not logged in"});
			}

			req.user.populate({ path: 'data.cart.product', model: 'Product' }, function(err, user){
				var totalPrice = 0;
				_.each(user.data.cart, function(item){
					totalPrice += item.product.internal.approximatePriceUSD * item.quantity;
				});

				Stripe.charges.create({
					amount: Math.ceil(totalPrice * 100), // amount in cents
					currency: "usd",
					source: req.body.stripeToken,
					description: "Example charge for amount : " + totalPrice
				}, function(err, charge) {
					if(err && err.type === 'StripeCardError') {
						return res.
						status(status.BAD_REQUEST).
						json({ error : err.toString() });
					}
					if(err){
						return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error : err.toString() });
					}

					//empty the cart upon successful checkout and save
					req.user.cart = [];
					req.user.save(function(err){
						if(err){
							console.log("WARNING, failed to clear cart : " + err.toString());
						}

						return res.json({ charge_id : charge.id });
					});
				});
			});
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
		req.user.populate({ path: 'data.cart.product', model: 'Product' }, handleOne.bind(null, 'user', res));
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