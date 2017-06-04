var express = require('express');
var MongoClient = require('mongodb').MongoClient;  
var ObjectId = require('mongodb').ObjectId;  
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var app = express()   //server side app



//Host the website on this server on port 3000 | Serve the front end front he folder public
app.use(express.static('public'));
app.use(bodyParser.json());

//Declaring a variable db
var db = null;
//Access chirpDB from the server
// Connect the Database to this server ||| Database is 'chirpDb' and the collection inside the database is called 'allchirps'
MongoClient.connect("mongodb://localhost:27017/chirpDb",function(err,dbConnection){
	if (!err) {
		console.log("Database is connected!!!");
		db = dbConnection;
	}
});

//Make an API.  // req contains the request object, res is response object to send data back, next is error object used to specify error
app.get('/chirps', function(req,res,next) {
	
	db.collection('allchirps', function(err,chirpsCollection){
		chirpsCollection.find().toArray(function(err,chirps){
		
		return res.json(chirps);
		});
	});
})

//handles the post request from the front end  
app.post('/chirps', function(req,res,next) {

	db.collection('allchirps', function(err,chirpsCollection){
		chirpsCollection.insert( {text: req.body.newChirp},{w:1},function(err,chirps){
		
		return res.send();
		});
	});

})

// Removes Chirp messages from the database
app.put('/chirps/remove', function(req,res,next) {

	db.collection('allchirps', function(err,chirpsCollection){
		chirpsCollection.remove( {_id: ObjectId(req.body.chirp._id)} ,{w:1},function(err,chirps){
		return res.send();
		});
	});
})

//Making a route to the users collection in the daatabse for this application
//handles the post requests to post passowrds  while signups
app.post('/users', function(req,res,next) {

	db.collection('users', function(err,usersCollection){
		
		bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(req.body.password, salt, function(err, hash) {
				var newUser = {
						username: req.body.username,
						password: hash
				};
				console.log(newUser);
				usersCollection.insert( newUser,{w:1},function(err){

				return res.send();		   
				});					
			});	
		});
	});
})

//Login check to login to the account
app.put('/users/signin', function(req,res,next) {

	db.collection('users', function(err,usersCollection){
		

	usersCollection.findOne({username:req.body.username}, function(err,user){
		
		// comapre the username nand password with the one int eh database
		bcrypt.compare(req.body.password, user.password, function(err, result){
			if (result) {
				res.send();
			}else{
				return res.status(400).send();
			}
		});
		
		});
	});
})



// Listen on port 3000 and after starting execute the function(second argument)
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})




