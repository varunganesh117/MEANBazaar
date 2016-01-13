var app = require('./server');
var assert = require('assert');
var superagent = require('superagent');

describe('Server', function(){
	var server = app();

	beforeEach(function() {
		server = app().listen(3000);
	});

	afterEach(function() {
		server.close();
	});

	it('Prints correct params when visting /api/v1/user', function(done){
	    superagent.get('http://localhost:3000/api/v1/user/varun?option=login', function(error, res) {
	      assert.ifError(error);
	      assert.equal(res.status, 200);
	      assert.equal(res.text, "Landed at page for User: varun with option : login");
	      done();
	    });	
    });
})