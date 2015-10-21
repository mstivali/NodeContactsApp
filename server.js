//---NodeJS Library Imports---//
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mdb = mongoose.connect('mongodb://localhost/test');

//---Dependency Injections---//
var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());
app.use(session({secret:'this is the secret'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//---Passport authentication initializations---//
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

var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	email:String,
	firstName:String,
	lastName:String,
	roles:[String]
});

var ContactSchema = new mongoose.Schema({
	name: String,
	email: String,
	number: String,
	userId: String
});

var UserModel = mongoose.model('User', UserSchema);
var ContactModel = mongoose.model('Contact', ContactSchema);

//var admin = new UserModel({username:'mstivali', password:'matt',firstName:'Matthew', lastName:'Stivali', roles:['admin']});
//var student = new UserModel({username:'shelshock', password:'shel',firstName:'Shelley', lastName:'Rush', roles:['student']});
//admin.save();
//student.save();

//var contact = new ContactModel({name:'Shelley', email:'shelshockdesign@gmail.com', number:'727-667-5091', userId:'56279bd0ab143a8c099aa11c'});
//contact.save();

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

app.get('/contactlist/:userId', function(req, res) {
	var userId = req.params.userId;
	console.log(userId);
	ContactModel.find({userId:userId}, function(err, contact) {
		console.log(contact);
		res.json(contact);
	});
});

app.get('/contactlist/contact/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	ContactModel.findOne({_id: id}, function(err, contact) {
		console.log(contact);
		res.json(contact);
	});
});

app.put('/contactlist/contact/:id', function(req, res) {
	var id = req.params.id;
	console.log(req.body.name);
	ContactModel.findOneAndUpdate({_id:id}, req.body, function(err, doc) {
		res.json(doc);
	});
});

app.post('/contactlist/contact', function(req, res) {
	console.log(req.body);
	var newContact = new ContactModel(req.body);
	newContact.save(function(err, contact) {
		res.json(contact);
	});
});

app.delete('/contactlist/contact/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	ContactModel.remove({_id: id}, function(err, doc){
		if(err) res.sendStatus(500);
		res.json(doc);
	});
});

app.listen(3000);
console.log("Server running on port 3000");