var fs = require('fs');
var Stripe = require('stripe');

module.exports = function(wagner){
	wagner.factory('Config', function(){
		return JSON.parse(fs.readFileSync('./config.json').toString());
	});	

	wagner.factory('Stripe', function(Config){
		return Stripe(Config.stripeKey);
	});
}