const braintree = require('braintree');
const {router} = require('./router');
const {merchantId, publicKey, privateKey} = require('./../config');


// var gateway = braintree.connect({
//     environment:  braintree.Environment.Sandbox,
//     merchantId:   merchantId,
//     publicKey:    publicKey,
//     privateKey:   privateKey
// });

// exports.handler = (event, context, callback) => {
//   const done = (err, response) => {
//     // return the required callback function
//     callback(null, {
//       headers: {
//         "Access-Control-Allow-Origin": "*", // need if calling API from WebView which is just a browser
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Headers":
//           "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
//       },
//       statusCode: err ? "400" : "200",
//       body: err
//         ? JSON.stringify({
//             type: "error",
//             err
//           })
//         : JSON.stringify({
//             type: "success",
//             response
//           })
//     });
//   };
//  }

// gateway.clientToken.generate({}, function (err, response) {
//   var clientToken = response.clientToken
// });



module.exports = {router};