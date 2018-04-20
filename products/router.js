const express = require('express');
const bodyParser = require('body-parser');
const {Product} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/addProduct', jsonParser, (req,res)=>{
	console.log('adding a product');
	let {companyName, productName, productDescription, productRating, productPrice, shippingPrice, productStock} = req.body;
	return Product.create({
		companyName,
		productName,
		productDescription,
		productRating,
		productPrice,
		shippingPrice,
		productStock
	})
	.then(function(product){
		return res.status(201).json(product.apiRepr());
	})
	.catch(function(err){
		console.log(err);
		console.error(err);
		res.status(666).json({
			code: 666,
			message: 'Demons have messed things up'
		});
	});
});

module.exports = {router};