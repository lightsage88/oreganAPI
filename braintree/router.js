const express = require('express');
const braintree = require('braintree');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {merchantId, publicKey, privateKey} = require('./../config');

let btReceipt;
let cart;
let billerEmail='';




var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   merchantId,
    publicKey:    publicKey,
    privateKey:   privateKey
});

exports.handler = (event, context, callback) => {
  const done = (err, response) => {
    // return the required callback function
    callback(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", // need if calling API from WebView which is just a browser
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
      },
      statusCode: err ? "400" : "200",
      body: err
        ? JSON.stringify({
            type: "error",
            err
          })
        : JSON.stringify({
            type: "success",
            response
          })
    });
  };
 }

gateway.clientToken.generate({}, function (err, response) {
  var clientToken = response.clientToken
});



router.get("/client_token", jsonParser, function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
  	console.log(response);
  	console.log(response.clientToken);
  	let clientToken = response.clientToken;
    return res.status(200).json(clientToken);
  });
});

router.post("/checkout", jsonParser, function(req, res){
  console.log('/checkout running...');
  console.log(req.body);
  let {cart, nonce, totalCost, countryNameShipping, 
    countryNameBilling, emailShipping, emailBilling, 
    extendedStreetShipping, extendedStreetBilling,firstNameShipping,firstNameBilling,
    lastNameShipping,lastNameBilling,id,localityBilling, localityShipping,phoneShipping,
    phoneBilling,postalCodeShipping,postalCodeBilling,regionShipping,regionBilling, 
    streetNameShipping, streetNameBilling, firstNameCustomer, 
    lastNameCustomer, emailCustomer, phoneCustomer, itemCost, shippingMethodCost, serviceFees, shippingMethodID} = req.body;
console.log('here is the cart');
console.log(cart);
console.log('we need to get just the bare minimum');
let thing;


  
  gateway.transaction.sale({
    amount: totalCost,
    paymentMethodNonce: nonce,
    customer: {
        firstName: firstNameCustomer,
        lastName: lastNameCustomer,
        company: "",
        phone: phoneCustomer,
        fax: "",
        website: "",
        email: emailCustomer
      },
      billing: {
        firstName: firstNameBilling,
        lastName: lastNameBilling,
        company: "",
        streetAddress: streetNameBilling,
        extendedAddress: extendedStreetBilling,
        locality: localityBilling,
        region: regionBilling,
        postalCode: postalCodeBilling,
        countryCodeAlpha2: countryNameBilling
      },
      shipping: {
        firstName: firstNameShipping,
        lastName: lastNameShipping,
        company: "",
        streetAddress: streetNameShipping,
        extendedAddress: extendedStreetShipping,
        locality: localityShipping,
        region: regionShipping,
        postalCode: postalCodeShipping,
        countryCodeAlpha2: countryNameShipping
      },
      customFields: {
        item_cost: itemCost,
        shipping_method_cost: shippingMethodCost,
        service_fees: serviceFees,
        mlab_user_id: id,
        shipping_method_id: shippingMethodID,
        shopper_cart: cart,
        shippo_details: 'placeholder',
        billing_email: emailBilling
      },

    options: {
      submitForSettlement: true
    }

  }, function (err, result){
    console.log('magic shuold be here');
    console.log(result);
    btReceipt = result;
    cart = cart;
    
    
    return res.status(202).json(result);
  });
});

module.exports = {router, btReceipt, cart};
