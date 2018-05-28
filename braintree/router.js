const express = require('express');
const braintree = require('braintree');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {merchantId, publicKey, privateKey} = require('./../config');

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
  let {nonce, totalCost} = req.body;
  console.log(nonce);
  console.log(totalCost);
  gateway.transaction.sale({
    amount: totalCost,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }

  }, function (err, result){
    console.log(result);
  });
});

module.exports = {router};
