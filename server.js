var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoose = require('mongoose');
var mdb = mongoose.connect('mongodb://localhost/test');

var express = require('express');
var app = express();

//Tells the server to look for our static files 
//containing html and angular app files
app.use(express.static(__dirname + "/public"));

var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	email:String,
	firstName:String,
	lastName:String,
	roles:[String]
});

var UserModel = mongoose.model('UserModel', UserSchema);

// var admin = new UserModel({username:'mstivali', password:'matt',firstName:'Matthew', lastName:'Stivali', roles:['admin']});
// var student = new UserModel({username:'shelshock', password:'shel',firstName:'Shelley', lastName:'Rush', roles:['student']});
// admin.save();
// student.save();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var bodyParser = require('body-parser');
var multer = require('multer');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());
app.use(session({secret:'this is the secret'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);

passport.use(new LocalStrategy(function(username, password, done) 
{
	UserModel.findOne({username:username, password:password}, function(err,user) {
		if(user) {
			return done(null, user);
		}

		return done(null, false, {message:'Unable to login'});
	});
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.post("/login", passport.authenticate('local'), function(req, res) {
	console.log("/login");
	console.log(req.user);
	res.json(req.user);
});

app.post('/logout', function(req, res) {
	req.logOut();
	res.sendStatus(200);
});

app.get("/loggedin", function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
})

app.post("/register", function(req, res) {
	var newUser = req.body;
	console.log(newUser);
	UserModel.findOne({username:req.body.username}, function(err, user) {

		if(err) { return next(err); }
		if(user) {
			res.json(null);
			return;
		} 

		var newUser = new UserModel(req.body);
		newUser.roles = ['student'];
		newUser.save(function(err, user) {
			req.login(user, function(err) {
				if(err) {return next(err); }
				res.json(user);
			});
		});
	});
});

var auth = function(req, res, next) {
	if(!req.isAuthenticated())
		res.sendStatus(401)
	else
		next();
};


app.get('/rest/users', auth, function(req, res) {
	UserModel.find(function(err, users) {
		res.json(users);
	});
});

//tells the server to listen for a get request under the route
//'/contactlist'
app.get('/contactlist', function(req, res) {
	console.log('I received a get request');
	
	db.contactlist.find(function(err,docs) {
		console.log(docs);
		res.json(docs);
	});

});

app.get('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

app.put('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(req.body.name);
	db.contactlist.findAndModify(
		{
			query: {_id: mongojs.ObjectId(id)},
			update: {$set: {name:req.body.name, email:req.body.email, number:req.body.number}},
			new:true
		}, function(err,doc){
			res.json(doc);
	});
});

app.post('/contactlist', function(req, res) {
	console.log(req.body);
	db.contactlist.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.delete('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	}); 
});

app.listen(3000);
console.log("Server running on port 3000");