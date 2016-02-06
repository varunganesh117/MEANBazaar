exports.navBar = function() {
	return {
		controller: 'NavBarController',
		templateUrl: '/templates/nav_bar.html'
	};
};

exports.productDesc = function() {
	return {
		controller: 'ProductDescController',
		templateUrl: '/templates/product_desc.html'
	};
};

exports.categoryBar = function() {
	return {
		controller: 'CategoryBarController',
		templateUrl: '/templates/category_bar.html'
	};
};

exports.productsList = function() {
	return {
		controller: 'ProductsListController',
		templateUrl: '/templates/products_list.html'
	};
};