var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require('body-parser');

//Tells the server to look for our static files 
//containing html and angular app files
app.use(express.static(__dirname + "/public"));

//Enables us to parse the body of incoming post requests to json
app.use(bodyParser.json());

//tells the server to listen for a get request under the route
//'/contactlist'
app.get('/contactlist', function(req, res) {
	console.log('I received a get request');
	
	db.contactlist.find(function(err,docs) {
		console.log(docs);
		res.json(docs);
	});

});

app.post('/contactlist', function(req, res) {
	console.log(req.body);
	db.contactlist.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.listen(3000);
console.log("Server running on port 3000");