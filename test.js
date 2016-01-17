var express = require('express');
var assert = require('assert');
var superagent = require('superagent');
var wagner = require('wagner-core');

describe('MEANBazaar Test', function(){
	var app;
	var server;
	var Category;

	describe('Server', function(){
		it('Prints correct params when visting /api/v1/user', function(done){
		    superagent.get('http://localhost:3000/api/v1/user/varun?option=login', function(error, res) {
		      assert.ifError(error);
		      assert.equal(res.status, 200);
		      assert.equal(res.text, "Landed at page for User: varun with option : login");
		      done();
		    });	
	    });
	});

	describe('Category API', function(){
		it('Inserts and gets a category by id', function(done){
			var category = {
				_id : 'Phone',
				parent: 'Electronics',
			};

			Category.create(category, function(err){
				assert.ifError(err);
				Category.count({}, function(err, count){
					assert.ifError(err);
					assert.equal(count, 1);
				});

				superagent.get('http://localhost:3000/api/v1/category/id/Phone', function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					var response = JSON.parse(res.text);
					console.log(response);
					assert.equal(response.category.parent, "Electronics");
					done();
			    });	
			})

	    });
	});

  //Clear db before tests
  before(function(done){
  	app = express();
  	//Bootstrap server
    models = require('./models')(wagner);

    //Get models for tests 
    var deps = wagner.invoke(function(Category){
    	return {
    		Category: Category
    	};
    })

    Category = deps.Category;
    Category.remove(function(err){
      if(err){
        done(err);
      }
      done();
    });

    app.use('/api/v1', require('./api.js')(wagner));
  	server = app.listen(3000);
  });

  after(function(done) {
  	server.close();
  	done();
  });
});
