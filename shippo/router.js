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


router.post('/createShipment', jsonParser, function(req,res){
	console.log('createShipment running...');
	console.log(req);
	console.log(req.body);
});


module.exports = {router};

