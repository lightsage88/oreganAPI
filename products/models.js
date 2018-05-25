const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ProductSchema = mongoose.Schema({
	//image: {
	// 	who knows???
	// },
	quantityOrdered: {
		type: Number
	},
	images: {
		type: Array
	}
	,
	dateToCart:{
		type: String
	},
	companyName: {
		type: String
	},
	productName:{
		type: String,
		require: true
	},
	productWeightKg: {
		type: Number,
		require: true
	},
	productWidthInches: {
		type: Number,
		require: true
	},
	productHeightInches: {
		type: Number,
		require: true
	},
	productLengthInches: {
		type: Number,
		require: true
	},
	//going to add LENGTH, WIDTH, HEIGHT
	//distance Unit will remain inches
	//Weight will be added up,
	//go to shippo and change your key to have the mass unit be ;kg'
	// var parcel = {
//     "length": "5",
//     "width": "5",
//     "height": "5",
//     "distance_unit": "in",
//     "weight": "2",
//     "mass_unit": "lb"
// };
	productDescription:{
		type: String,
		require: true
	},
	productRating:{
		type: Number
	},
	productPrice:{
		type: Number,
		require: true
	},
	shippingPrice:{
		type: Number,
		require: true
	},
	productStock: {
		type: Number,
		require: true
	},
	productType:{
		type: String,
		require: true
	}
});

ProductSchema.methods.apiRepr = function(){
	return {
		id: this.id,
		quantityOrdered: this.quantityOrdered || '',
		images: this.images || '',
		dateToCart: this.dateToCart || '',
		companyName: this.companyName || '',
		productName: this.productName || '',
		productDescription: this.productDescription || '',
		productRating: this.productRating || '',
		productPrice: this.productPrice || '',
		shippingPrice: this.shippingPrice || '',
		productStock: this.productStock || '',
		productType: this.productType || '',
		productWeightKg: this.productWeightKg || '',
		productWidthInches: this.productWidthInches || '',
		productHeightInches: this.productHeightInches || '',
		productLengthInches: this.productLengthInches || ''
	}
}

const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};

