var status = require('http-status');

exports.$user = function($http){
	var obj = {};

	obj.loadUser = function(){
		$http.
			get('/api/v1/me').
			success(function(data){
				obj.user = data.user;
			}).
			error(function(data, res){
				if(res === status.UNAUTHORIZED){
					obj.user = null;
				}
			});
	};

	obj.loadUser();

	setInterval(obj.loadUser, 60 * 60 * 1000);

	return obj;
};