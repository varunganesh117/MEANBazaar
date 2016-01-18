var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');

var productSchema = {
	name : { type: String, required: true },
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

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;