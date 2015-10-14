var express = require('express');
var app = express();

//Tells the server to look for our static files 
//containing html and angular app files
app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");