exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL; //need to establish an mlab next
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'pepperTheCat';
exports. JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';


