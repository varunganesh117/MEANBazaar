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

exports.SearchBarController = function($scope, $http) {
	$scope.searchText = undefined;

	$scope.update = function() {
	    if($scope.searchText.trim()){
	      var encoded = encodeURIComponent($scope.searchText);
	      $http.get('/api/v1/product/text/' + encoded).
	      success(function(data) {
	        $scope.results = data.products;
	      });
	    }else{
	      $scope.results = [];
	    }
	};

	setTimeout(function() {
		$scope.$emit('SearchBarController');
	}, 0);
};

exports.AddToCartController = function($scope, $http, $user) {
	$scope.success = false;

	$scope.addToCart = function(product){
		if(!$user.user){
			return;
		}

		$user.user.data.cart.push({ product : product._id , quantity : 1 });

		var data = { data : { cart : $user.user.data.cart } };

		$http.put('/api/v1/me/cart', data).
		success(function(data){
			$user.loadUser();
			$scope.success = true;
		});
	};

	setTimeout(function() {
		$scope.$emit('AddToCartController');
	}, 0);
};

exports.CheckoutController = function($scope, $http, $user) {
	$scope.user = $user;


};