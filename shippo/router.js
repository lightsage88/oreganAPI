// SHIPPO ROUTER


const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {SHIPPO_KEY} = require('./../config');

//for now I'm putting a sample address
var addressFrom  = {
    "name": "Oregan-PTD",
    "street1": "1785 SW Pheasant Drive",
    "city": "Aloha",
    "state": "OR",
    "zip": "97006",
    "country": "US",
    "phone": "+1 971-226-2846",
    "email": "adrian.e.rosales@gmail.com"
};


var shippo = require('shippo')(SHIPPO_KEY);
var mass_unit = 'kg';

router.post('/createShipment', jsonParser, function(req,res){
	console.log('createShipment running...');
	// let {addressTo, parcel} = req.body;

	console.log(req.body);
	let {firstNameShipping, lastNameShipping, streetNameShipping, cityShipping, sprShipping, 
		zipShipping, countryShipping, widthShipping, heightShipping, lengthShipping, weightShipping, emailShipping, phoneShipping} = req.body;
	
	console.log(widthShipping);
	console.log(heightShipping);
	console.log(lengthShipping);
	console.log(weightShipping);
	let parcel = {
		"length": lengthShipping,
		"width": widthShipping,
		"height": heightShipping,
		"distance_unit": "in",
		"weight": weightShipping,
		"mass_unit": "kg"
	};
	let addressTo = {
		"name": firstNameShipping + lastNameShipping,
		"street1": streetNameShipping,
		"city": cityShipping,
		"state": sprShipping,
		"zip": zipShipping,
		"country": countryShipping,
		"phone": phoneShipping,
		"email": emailShipping
	};
console.log(addressTo);
console.log(parcel);
	shippo.shipment.create({
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": [parcel],
    "async": false
	}, function(err, shipment){
    console.log(shipment.rates);
    let rates = shipment.rates;
    return res.status(202).json(rates);
	})
	.catch(function(err){
		return res.status(404).json({message: 'problem creatingShipment'});
	});
});
module.exports = {router};

