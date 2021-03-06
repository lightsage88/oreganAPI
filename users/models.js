const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	// username: {
	// 	type: String,
	// 	require: true,
	// 	unique: true
	// },
	emailAddress: {
		type: String,
		require: true,
		unique: true
	},
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	cellNumber: {
		type: Number,
		required: true
	},
	cart: Array,
	pastPurchases: Array,
	checkout: Array
});

UserSchema.methods.apiRepr = function(){
	return {
		id: this.id,
		username: this.username || '',
		emailAddress: this.emailAddress || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
		cellNumber: this.cellNumber || '',
		cart: this.cart,
		pastPurchases: this.pastPurchases,
		checkout: this.checkout
	};
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};