describe('Testing navBar directive', function(){
	var injector;
	var scope;
	var element;
	var compile;
	var httpBackend;

	beforeEach(function(){
	    injector = angular.injector(['mean-bazaar', 'ngMockE2E']);
	    intercepts = {};

	    injector.invoke(function($rootScope, $compile, $httpBackend) {
	      scope = $rootScope.$new();
	      compile = $compile;
	      httpBackend = $httpBackend;
	    });
	});

	it('Loads user and displays picture', function(done){
		httpBackend.whenGET('/templates/nav_bar.html').passThrough();
		httpBackend.expectGET('/api/v1/me').respond(
			{ user : { profile : { picture : 'linkToMyPicture' } } });

	    element = compile('<nav-bar></nav-bar>')(scope);
	    scope.$apply();
		
		scope.$on('NavBarController', function(){
			httpBackend.flush();

			assert.equal(element.find('.title').text().trim(), 'MEAN Bazaar');
			assert.notEqual(element.find('.user-info .user').css('display'), 'none');
			assert.equal(element.find('.user-info .user img').attr('src'), 'linkToMyPicture');
			done();
		});
	});
});