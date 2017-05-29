const express = require('express') 
const app = express()   //server side app

//Host the website on this server on port 3000 | Serve the front end front he folder public
app.use(express.static('public'));

//Make an API
app.get('/chirps', function(req,res,next) {
	var chirps = [
		'Hi I am a new chirp! ',
		'Wola!!! Wassup guys', 
		'I just got a new brother', 
		'Woho! Congratulations chirp',
		'Hello again!'
	];

	res.send(chirps);
})

// Listen on port 3000 and after starting execute the function(second argument)
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})