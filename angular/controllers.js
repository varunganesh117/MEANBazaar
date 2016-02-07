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
};

exports.ProductsListController = function($scope, $routeParams, $http){
	var encodedId = encodeURIComponent($routeParams.categoryId);
	$scope.price = undefined;

	$scope.handleSortClick = function(){
		if($scope.price == undefined){
			$scope.price = -1;
		}else{
			$scope.price *= -1;
		}

		$scope.loadProducts();
	}

	$scope.loadProducts = function(){
		var queryParams = { price : $scope.price };
		$http.get('/api/v1/product/category/' + encodedId, { params : queryParams }).
		success(function(data){
			$scope.products = data.products;
		});
	}

	$scope.loadProducts();

	setTimeout(function() {
		$scope.$emit('ProductsListController');
	}, 0);
}