const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ProductSchema = mongoose.Schema({
	//image: {
	// 	who knows???
	// },
	companyName: {
		type: String
	},
	productName:{
		type: String,
		require: true
	},
	productDescription:{
		type: String,
		require: true
	},
	productRating:{
		type: Number
	},
	productPrice:{
		type: String,
		require: true
	},
	shippingPrice:{
		type: String,
		require: true
	},
	productStock: {
		type: Number,
		require: true
	}
});

ProductSchema.methods.apiRepr = function(){
	return {
		id: this.id,
		companyName: this.companyName || '',
		productName: this.productName || '',
		productDescription: this.productDescription || '',
		productRating: this.productRating || '',
		productPrice: this.productPrice || '',
		shippingPrice: this.shippingPrice || '',
		productStock: this.productStock || ''
	}
}

const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};

