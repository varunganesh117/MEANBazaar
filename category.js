var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
	_id : String,
	parent : {
		type: String,
		ref: 'Category'
	},
	ancestors: [{
		type: String,
		ref: 'Category'
	}]
});

module.exports = categorySchema;