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
	});

	setTimeout(function() {
		$scope.$emit('ProductDescController');
	}, 0);
};

exports.CategoryBarController = function($scope, $routeParams, $http){
	var encodedId = encodeURIComponent($routeParams.categoryId);

	$http.get('/api/v1/category/id/' + encodedId).
	success(function(data){
		$scope.category = data.category;
		$http.get('/api/v1/category/parent/' + encodedId).
		success(function(data){
			$scope.children = data.categories;
		});
	});

	setTimeout(function() {
		$scope.$emit('CategoryBarController');
	}, 0);
}