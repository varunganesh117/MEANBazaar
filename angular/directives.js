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
}