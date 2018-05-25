const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const router = express.Router();

const request = require('request');

const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');

router.post('/', jsonParser, (req,res)=>{
	console.log('running our bland post');
	const requiredFields = ['username', 'emailAddress', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if(missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'There is a missing field among the required fields',
			location: missingField
		});
	}

	const stringFields = ['username', 'emailAddress', 'password', 'firstName', 'lastName', 'cellNumber'];
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
		);
		if(nonStringField) {
			return res.status(422).json({
				code: 422,
				reason: 'ValidationError',
				message: 'A non-string was used where a string should have been',
				location: nonStringField
			});
		}

		const explicityTrimmedFields = ['username', 'emailAddress', 'password'];
		const nonTrimmedField = explicityTrimmedFields.find(field=>req.body[field].trim() !== req.body[field]);
	if(nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'You need to get rid of the white space',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		password: {
			min: 8,
			max: 30
		}
	};

	const tooSmallField = Object.keys(sizedFields).find(
		field=> 'min' in sizedFields[field] && req.body[field].trim().length 
				< sizedFields[field].min);

	const tooLargeField = Object.keys(sizedFields).find(
		field => 'max' in sizedFields[field] && req.body[field].trim().length 
				> sizedFields[field].max);

	if(tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField ? `Your input was too small, it must be at least ${sizedFields[tooSmallField]} characters long.`
					: `Your input is too large, it must not be over ${sizedFields[tooLargeField]} characters long.`,
			location: tooSmallField || tooLargeField
		});
	}

	let {username, emailAddress, password, firstName, lastName, cellNumber} = req.body;
	console.log(req.body);
	console.log(emailAddress);
	return User.find({username})
		.count()
		.then(function(count){
			if(count>0) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'This username has already been used!',
					location: 'username'
				});
			}

			return User.hashPassword(password);
		})
		.then(function(hash){
			console.log('hashing away');
			console.log(hash);
			return User.create({
				username,
				emailAddress,
				password: hash,
				firstName,
				lastName,
				cellNumber,
				cart,
				pastPurchases,
				checkout
			});
		})
		.then(function(user){
			return res.status(201).json(user.apiRepr());
		})
		.catch(function(err){
			if(err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}

			res.status(500).json({
				code: 500,
				message: 'An unknown error has occured, sorry about that'
			});

		});
});

router.get('/', function(req, res){
//this endpoint will return all users to us
	return User.find()
	.then(function(users){
		let set = [];
		for(let i=0; i<=users.length-1; i++) {
			set.push(users[i].apiRepr());
		}
		return res.status(200).json(set);
	})
	.catch(function(err){
		return res.status(500).json({message: 'ISError'});
	});
});

router.delete('/', jsonParser, (req, res)=>{
	console.log('deleting a user');
	let {id} = req.body;
	console.log(id);
	return User.findOne({'_id':id})
	.then((user)=>{
		let killSwitch = id;
		return User.deleteOne({'_id': killSwitch})
		.then((response)=>{
			console.log(`account with the id of ${killSwitch} has been deleted`);
			res.status(204).json({message: 'Account Deleted'});
		})
		.catch((err)=>{
			console.log(err);
			console.error(err);
			return res.status(500).json({message: `Internal Server Issue`});
		});
	})
});

router.put('/', jsonParser, function(req, res){
//a put endpoint to edit the basic account details of a users account, not involved with the cart/past purchases
	console.log('editing details');
	console.log(req.body);
	let {_id, firstName, lastName, cellNumber} = req.body;
	User.updateOne({_id},
			{$set: 
				{
					firstName: firstName,
					lastName: lastName,
					cellNumber: cellNumber
				}
			})
			.then(function(){
				res.status(202);
				return User.findOne({_id})
				.then((response)=>{
					res.status(202).json(response);
				})
			})
			.catch((err)=>{
				console.log(err);
				console.error(err);
			});
});

router.post('/persist', jsonParser, (req,res)=>{
	let {_id} = req.body;
	User.findOne(
		{'_id': _id}
		)
	.then((response)=>{
		console.log(response);
		return res.status(202).json(response);
	})

});

router.put('/itemIntoCart', jsonParser, (req,res)=>{
	let {cart, userid, pageType} = req.body;
	User.update({'_id':userid}, {$set: {'cart':cart}})
	.then(response=>{
		console.log(response);
		res.status(202).json(response);	
	});
});
//////////////////////////////
// router.put('/itemIntoCart', jsonParser, (req, res)=>{
// let number;
// function firstCartItem(){

// for(let i = 0; i<=cart.length-1; i++){
// 	if(cart[i].id === item.id){
// 		console.log('doppelganger');
// 		console.log(i);
// 		number = i;
// 		User.update({_id:userid}, {$set: `cart.${i}: null` })
		
		
// 	} else {
// 	User.updateOne({'_id': userid}, {$addToSet: {cart: item	}})
// 		.then(response=>{
// 		console.log(response);
// 		res.status(202).json(response);
// 	});
// 	}
// }


// }

// console.log('itemintocart running..');
// let {cart, cartLength, pageType, userid, quantityOrdered, companyName, id, productDescription,productName,productPrice, shippingPrice, productRating, productStock, productType} = req.body;
// let item = {quantityOrdered, companyName,id,productDescription,productName,productPrice,shippingPrice,productRating,productStock,productType};

// 	firstCartItem();


// });



module.exports = {router};