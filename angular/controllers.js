exports.NavBarController = function($scope, $user) {
	$scope.user = $user;

	setTimeout(function() {
		$scope.$emit('NavBarController');
	}, 0);
};

exports.ProductDescController = function($scope, $routeParams, $http){
	var encodedId = encodeURIComponent($routeParams.productId);
	$http.
	get('api/v1/product/id/'+ encodedId).
	success(function(data){
		$scope.product = data.product;
	})

	setTimeout(function() {
		$scope.$emit('ProductDescController');
	}, 0);

};