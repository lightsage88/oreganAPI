const express = require('express');
const bodyParser = require('body-parser');
const {Product} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/addProduct', jsonParser, (req,res)=>{
	console.log('adding a product');
	let {quantityOrdered, 
		companyName, 
		productName, 
		productDescription, 
		productRating, 
		productPrice, 
		shippingPrice, 
		productStock, 
		productType} = req.body;
		
	return Product.create({
		quantityOrdered,
		companyName,
		productName,
		productDescription,
		productRating,
		productPrice,
		shippingPrice,
		productStock,
		productType
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

router.post('/retrieve', jsonParser, (req,res)=>{
	let {productType} = req.body
	console.log(productType);
	return Product.find({'productType': productType})
	.then(function(products){
		let set = [];
		for(let i = 0; i<=products.length-1; i++) {
			set.push(products[i].apiRepr());
		}
		return res.status(202).json(set);
	})
	.catch(function(err){
		return res.status(606).json({message: 'searchProblem'});
	});
});

module.exports = {router};