require('dotenv').config();
const express = require('express');//express is a framework for backend apps, comprised of many apps
const mongoose = require('mongoose');//mongoose lets us interact with mongoDB
const morgan = require('morgan');//morgan is a commonly used logging plugin, its handy
const passport = require('passport');//passport is the backbone of our security apparatus
const bodyParser = require('body-parser');//should we need to use it, this will let us sniff out data from promises and turn it into json
const braintree = require('braintree');
const app = express();
const jsonParser = bodyParser.json();

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: productRouter} = require('./products');
const {router: braintreeRouter} = require('./braintree');
// const {router: shippoRouter} = require('./shippo');
mongoose.Promise = global.Promise;
const {PORT, SHIPPO_KEY,DATABASE_URL, merchantId, publicKey, privateKey} = require('./config');


//we will use morgan for logging
app.use(morgan('common'));

//for now I will set up our api to be very open for cross origin resource sharing, we can chagne this later
app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	if(req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy); 

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/products/', productRouter);
app.use('/api/braintree/', braintreeRouter)

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/api/protected', jwtAuth, (req,res)=>{
	return res.json({
		data: 'you must be a nerd to have gotten here'
	});
});

let server;

function runServer() {
	return new Promise((resolve, reject)=>{
		mongoose.connect(DATABASE_URL, {useMongoClient: true}, err =>{
			if(err) {
				return reject(err);
			}
			server = app
			.listen(PORT, ()=>{
				console.log(`OregAN API will be running on port: ${PORT}`);
				
				resolve();
			})
			.on('error', err=>{
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer(){
	return mongoose.disconnect().then(()=>{
		return new Promise((resolve, reject)=>{
			console.log('Closing Server for OregAN API');
			server.close(err=>{
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}
// shippo_test_c3f2fe6e2f03cd8c8908a44c6509cd0a679b345b
var shippo = require('shippo')('shippo_test_c3f2fe6e2f03cd8c8908a44c6509cd0a679b345b');
let shipment;

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

var addressTo = {
    "name": "Mr Hippo",
    "street1": "30 Bạch Đằng",
    "city": "Kon Tum",
    "country": "VN",
    "zip": "580000",
    "phone": "+84 260 3863 334",
    "email": "mrhippo@goshippo.com"
};

var parcel = {
    "length": "5",
    "width": "5",
    "height": "5",
    "distance_unit": "in",
    "weight": "2",
    "mass_unit": "lb"
};
//we specify which carrier accounts we want to use by passing in each
// shippo.carrieraccount.create({
//     "carrier":"fedex", 
//     "account_id":"510087240", 
//     "parameters":{"meter":"119044507"},
//     "test":true,
//     "active":true
// }, function(err, account) {
//   	console.log(account);
// });


shippo.shipment.create({
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": [parcel],
    "async": false
}, function(err, shipment){
    console.log(shipment);
    shipment=shipment;
    var rate = shipment.rates[0];
    console.log(rate);
    console.log('take it back to the register');
    console.log(shipment.rates);
	shippo.transaction.create({
		"rate": rate.object_id,
		"label_file_type": "PDF",
		"async": false
	}, function(err, transaction){
		console.log(transaction);
	});
});
// var addressFrom = {
// 	"name":"Shawn Toppple",
// 	"street1": "215 Clayton St.",
// 	"city":"San Francisco",
// 	"state":"CA",
// 	"zip":"94117",
// 	"country":"US",
// 	"phone":"+1 555 341 9393",
// 	"email":"shippottle@goshippo.com"
// };

// var addressTo = {
// 	"name":"Mr. Hippo",
// 	"street1":"Broadway 1",
// 	"city":"New York",
// 	"state":"NY",
// 	"zip":"10007",
// 	"country":"US",
// 	"phone":"+1 555 341 9393",
// 	"email":"mrhippo@goshippo.com"
// };

// var parcel = {
// 	// "length": "",
// 	// "width":"",
// 	// "height":"",
// 	// "distance_unit":"",
// //We should create an algorithm to figure out the combined dimensions of the users cart
// //then we can make sure that it is smaller than what the various templates offer ;)
// //also we should have kilograms (kg) be our weight method of choice.
// 	"template": "FedEx_Box_Large_1",
// 	"weight":"2",
// 	"mass_unit": "lb"
// };

// shippo.shipment.create({
// 	"address_from":addressFrom, 
// 	"address_to":addressTo,
// 	"parcels": [parcel],
// 	"async": false
// }, function(err,shipment){
// 	//asynchronously called
// 	console.log(shipment);
// 	shipment= shipment;
// }); 
//For the various values, such as TO FROM, WEIGHT, etc,
//we should make an endpoint for once this portion is
//modularized, allowing us to make a call to the endpoint and having the
//shippo npm generate labels, etc for us.
//Now we have our shipment object showing up in the console.
//next we need a transaction object

// var rate = shipment.rates[0];

// shippo.transaction.create({
// 	"rate": rate.object._id,
// 	"label_file_type": "PDF",
// 	"async": false
// }, function(err, transaction){
// 	console.log(transaction);
// });

if(require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};