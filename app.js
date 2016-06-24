var express = require("express");
var promise = require("bluebird");
var path = require("path");
// var passport = require("passport");
// var LocalStrategy = require('passport-local').Strategy;
// var session = require("session");
var app = express();

var options = {
	promiseLib: promise
};

var pgp = require("pg-promise")(options);

var connection = {
	host: 'localhost',
	port: 5432,
	database: 'favorite_movies',
	user: 'postgres',
	password: '12345'
};

var db = pgp(connection);

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));

//used for passport authentication via passport-local strategy
// app.use(passport.session({ secret: ' this site is awesome '}));
// app.use(passport.initialize());
// app.use(passport.session());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//used to return a user object for user verification upon login
// function verifyUser(username){
// 	db.one('SELECT * FROM users WHERE username=$1', username)
// 	.then(function(user){
// 		return {err: null, user: user};
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 		return {err: err, user:null};
// 	});
// };

//used to verify that entered password is correct
//function validPassword(user, )

//user login session management
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     //code to verify login info goes here
//     verifyUser(username, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.password === password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

//get all users
app.get("/", function(req, res, next){
	db.any("SELECT * FROM users")
	.then(function(users){
		res.render("index", {users: users});
	})
	.catch(function(err){
		return next(err);
	});
});

// app.post('/login', passport.authenticate('local', function(req,res,next){
// 	res.redirect('/users/' + req.body.username);
// }));

app.get("/users/:name", function(req,res,next){
	db.task(t=> {
		return t.one("SELECT * FROM users WHERE username='" + req.params.name + "'")
		.then(user=> {
			console.log(user);
			return t.any("SELECT * FROM favorites WHERE username='" + user.name + "'");
		});
	})
	.then(movies=> {
		console.log(movies);
		res.render("user", {username: req.params.name, movies: movies});
	})
	.catch(error=> {
		return next(error);
	});
});

app.get("/login", function(req,res,next){
	res.render('login');
});

app.get("/search/:name", function(req,res){
	res.render("search", {username: req.params.name});
});

app.post('/savedata', function(req,res,next){
	var id=req.body.id;
	db.one('SELECT * FROM favorites WHERE imdbid=\'$1\'', id)
	.then(function(movie){
		console.log(movie);
		if(movie.imdbid !== ""){
			db.none('INSERT INTO favorites (username, imdbid) VALUES (\'' + req.body.username + '\', \'' + req.body.id + '\')')
			.catch(function(error){
				return next(error);
			});
		}
	})
	.catch(function(err){
		return next(err);
	});
	res.redirect('/search/' + req.body.username);
});

/*
Figure out how to check above if the movie is already in the database or not.
Add it if yes, otherwise just redirect to the search page for the logged in user.
*/

app.post('/login', function(req,res,next){
	db.one('SELECT * FROM users WHERE username=$1', req.body.username)
	.then(function(user){
		if(user.password === req.body.password){
			res.redirect('/search/' + user.username);
		}
		else{
			res.redirect('/loginerror');
		}
	})
	.catch(function(err){
		res.redirect('/loginerror');
	});
});

app.get('/loginerror', function(req,res){
	res.send("<center><h1>Error! Invalid Login</h1><p>Click <a href='/login'>here</a> to return to the login page.</p></center>");
});


app.listen(3000, function(){
	console.log("Favorite Movies app listening on port 3000.");
});