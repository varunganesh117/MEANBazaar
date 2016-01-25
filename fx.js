var superagent = require('superagent');
var _ = require('underscore');

module.exports = function(Config){
	var rates = {
		USD : 1,
		EUR : 1.1,
		GBP : 1.5
	};

	var ping = function(callback){
		superagent.get('http://openexchangerates.org/api/latest.json?app_id=' + Config.openExchangeRatesKey, function(err, res){
			if(err){
				if(callback){
					callback(err);
				}
				return;
			}

			var results;
			try{
				results = JSON.parse(res.text);
				_.each(results.rates || {}, function(value, key){
					rates[key] = value;
				});
			}catch(e){
				if(callback){
					callback(e);
				}
			}
		});
	};

	setInterval(ping, 3600*1000);

	var foo = function(){
		return rates;
	}
	foo.ping = ping;

	ping();
	return foo;
}