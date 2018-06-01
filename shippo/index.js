const shippo = require('shippo');
const {router} = require('./router');
const {SHIPPO_KEY} = require('./../config');
const {shippoReceipt} = require('./router');
module.exports = {router, shippoReceipt};