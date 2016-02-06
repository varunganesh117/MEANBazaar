var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('mean-bazaar.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('mean-bazaar', ['ngRoute', 'mean-bazaar.components']);

app.config(function($routeProvider){
	$routeProvider.when('/product/:productId', {
		controller : 'ProductDescController',
		templateUrl : 'templates/product_desc.html'
	});
});