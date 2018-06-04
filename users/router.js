const result = require('../braintree/router');

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const router = express.Router();

const request = require('request');

const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');

//Imports from bt and shippo routers
const {btReceipt, cart} = require('../braintree');
const {shippoReceipt} = require('../shippo');
//
console.log(btReceipt);
	console.log(cart);
	console.log(shippoReceipt);


let id = '';
router.get('/testshit', jsonParser, (req,res)=>{
	console.log('testshit running...');
	console.log(btReceipt);
	console.log(cart);
	console.log(shippoReceipt);
});



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
	let {id} = req.body;
	return User.findOne({'_id':id})
	.then((user)=>{
		let killSwitch = id;
		return User.deleteOne({'_id': killSwitch})
		.then((response)=>{
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
		res.status(202).json(response);	
	});
});

router.put('/finishTransaction', jsonParser, (req,res)=>{
	
	let {receipt} = req.body;
	let object = receipt.transaction;
	id = receipt.transaction.customFields.mlabUserId;
	User.update({'_id': id}, {$push: {'pastPurchases':object}, $set:{'cart': []} } )
	.then(response => {
		console.log(response);
		res.status(202).json(response);
	});



});


router.put('/addShippoToMlab', jsonParser, (req,res)=> {
	let {shippoObject, id} = req.body;
	console.log(shippoObject);
	console.log(id);
	let rate = shippoObject.rate;
	console.log('here is our rate, yo');
	console.log(rate);

	// User.update({'_id':id},
	// //we want to find the last chunk in pastPurchases, then go to customFields, and insert a key 'shippoObject' with our [shippoObject] in there.
	//  {})

	// User.find({"pastPurchases.$": rate})
	// .then(function(users){
	// 	console.log('...maybe this worked?');
	// 	console.log(users)
	// })
	// .catch(err=> {
	// 	console.log(err);
	// });

	// User.update(
	// 	{'_id': id, 'pastPurchases.id': 'fhyw2xy5'},
	// 	{$set: {"pastPurchases.$.shippoDetails": shippoObject} }

	// 	)
	// .then(response=>{
	// 	console.log('dont have a cow');
	// 	console.log(response);
	// 	res.status(204).json(response);
	// });

});


module.exports = {router};