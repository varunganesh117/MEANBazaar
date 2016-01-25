var mongoose = require('mongoose');
var Category = require('./category');

module.exports = function(db, fx){

	var productSchema = {
		name : { type: String, required: true },
		pictures: [{ type: String, match: /^http:\/\//i }],
		price : {
			amount : {
				type : Number,
				required : true,
				set : function(value){
					this.internal.approximatePriceUSD = value / (fx()[this.price.currency] || 1);
					return value;
				}
			},
			currency : {
				type : String,
				required : true,
				set : function(value){
					this.internal.approximatePriceUSD = this.price.amount / (fx()[value] || 1);
					return value;
				}
			}
		},
		category: Category.categorySchema,
		internal : {
			approximatePriceUSD : { type: Number }
		}
	};

	var schema = new mongoose.Schema(productSchema);

	schema.index({ name: 'text'});

	var symbols = {
		'USD' : '$',
		'EUR': '€',
		'GBP': '£'
	};

	schema.virtual('displayPrice').get(function(){
		return symbols[this.price.currency] + ' ' + this.price.amount;
	});

	schema.set('toObject', { virtuals: true });
	schema.set('toJSON', { virtuals: true });

	return db.model('Product', schema, 'products');
}