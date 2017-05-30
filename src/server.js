var express = require('express');
var MongoClient = require('mongodb').MongoClient;  
var ObjectId = require('mongodb').ObjectId;  
var bodyParser = require('body-parser');
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

	// console.log(req.body.newChirp);
	// chirps.push(req.body.newChirp);

	db.collection('allchirps', function(err,chirpsCollection){
		chirpsCollection.insert( {text: req.body.newChirp},{w:1},function(err,chirps){
		
		return res.send();
		});
	});

})


// Removes Chirps 
app.put('/chirps/remove', function(req,res,next) {

	db.collection('allchirps', function(err,chirpsCollection){
		chirpsCollection.remove( {_id: ObjectId(req.body.chirp._id)} ,{w:1},function(err,chirps){
		return res.send();
		});
	});
})

// Listen on port 3000 and after starting execute the function(second argument)
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})