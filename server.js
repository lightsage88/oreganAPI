require('dotenv').config();
const express = require('express');//express is a framework for backend apps, comprised of many apps
const mongoose = require('mongoose');//mongoose lets us interact with mongoDB
const morgan = require('morgan');//morgan is a commonly used logging plugin, its handy
const passport = require('passport');//passport is the backbone of our security apparatus
const bodyParser = require('body-parser');//should we need to use it, this will let us sniff out data from promises and turn it into json
const app = express();

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');


//we will use morgan for logging
app.use(morgan('common'));

//for now I will set up our api to be very open for cross origin resource sharing, we can chagne this later
app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	if(req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwt = passport.authenticate('jwt', {session: false});

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

if(require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};