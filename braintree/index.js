const braintree = require('braintree');
const {router} = require('./router');
const {merchantId, publicKey, privateKey} = require('./../config');


module.exports = {router};