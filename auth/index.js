const {User} = require('../users/models');
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy};

