var express = require('express');
var assert = require('assert');
var superagent = require('superagent');
var wagner = require('wagner-core');

var OBJECT_ID = '000000000000000000000001';

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
				_id : 'Phones',
				parent: 'Electronics',
			};

			Category.create(category, function(err){
				assert.ifError(err);
				superagent.get('http://localhost:3000/api/v1/category/id/Phones', function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					var response = JSON.parse(res.text);
					assert.equal(response.category.parent, "Electronics");
					done();
			    });	
			});
	    });

	    it('Gets categories by Parent id', function(done){
			var category = {
				_id : 'Laptops',
				parent: 'Electronics',
			};

			Category.create(category, function(err){
				assert.ifError(err);

				superagent.get('http://localhost:3000/api/v1/category/parent/Electronics', function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					var response = JSON.parse(res.text);
					assert.equal(response.categories.length, 2);
					done();
			    });	
			});
	    });

	    it('Gets a product by object id', function(done){
	    	superagent.get('http://localhost:3000/api/v1/product/id/'+ OBJECT_ID, function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					var response;
					assert.doesNotThrow(function(){
						response = JSON.parse(res.text);
					});
					assert.equal(response.product.name, 'Nexus 5x');
					done();
			});
	    });

		it('Gets products by category sorted ascending by price', function(done){
	    	superagent.get('http://localhost:3000/api/v1/product/category/Electronics?price=1', function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					var response;
					assert.doesNotThrow(function(){
						response = JSON.parse(res.text);
					});
					assert.equal(response.products.length, 2);
					assert.equal(response.products[0].name, 'Nexus 5x');
					assert.equal(response.products[1].internal.approximatePriceUSD, 2000);
					done();
			});	
	    })
	});


  before(function(){
  	app = express();
  	//Bootstrap server
    models = require('./models')(wagner);

    //Get models for tests 
    var deps = wagner.invoke(function(Category, Product){
    	return {
    		Category : Category,
    		Product : Product
    	};
    })

    Category = deps.Category;
    Product = deps.Product;

    app.use('/api/v1', require('./api.js')(wagner));
  	server = app.listen(3000);
  });

  //Clear db before tests
  before(function(done){
    Category.remove({}, function(error) {
      assert.ifError(error);
      Product.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  before(function(done){
  	var categories = [
      { _id: 'Electronics' },
      { _id: 'Bacon' }
    ];

    var products = [
      {
      	_id: OBJECT_ID,
        name: 'Nexus 5x',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
        price: {
          amount: 400,
          currency: 'USD'
        }
      },
      {
        name: 'Asus Zenbook Prime',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      {
        name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon'] },
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];

    Category.create(categories, function(error) {
      assert.ifError(error);
      Product.create(products, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  after(function(done) {
  	server.close();
  	done();
  });
});
