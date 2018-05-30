const braintree = require('braintree');
const {router, result} = require('./router');
const {merchantId, publicKey, privateKey} = require('./../config');


module.exports = {router, result};