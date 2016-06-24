var express = require("express");
var promise = require("bluebird");
var path = require("path");
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

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

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

app.get("/users/:name", function(req,res,next){
	db.any('SELECT * FROM favorites WHERE username=$1', req.params.name)
	.then(function(movies){
		res.render('user', {username: req.params.name, movies: movies});
	})
	.catch(function(err){
		return next(err);
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
	db.any('SELECT * FROM favorites WHERE imdbid=\'' + id + '\' AND username=\'' + req.body.username + '\'')
	.then(function(movie){
		console.log(movie[0]);
		if(movie[0] !== undefined){
			db.none('INSERT INTO favorites (username, imdbid, description, imgsrc) VALUES (\'' + req.body.username
			+ '\', \'' + req.body.id + '\', \'' + req.body.description + '\', \'' + req.body.poster + '\')')
		.catch(function(error){
			return next(error);
		})
	}})
	.catch(function(err){
		return next(err);
	});
	res.redirect('/search/' + req.body.username);
});

/*
Figure out how to check above if the movie is already in the database or not.
Add it if yes, otherwise just redirect to the search page for the logged in user.
*/

app.delete('/users/:un', function(req,res,next){
	db.none('DELETE FROM favorites WHERE username=\'' + req.params.un + '\' AND imdbid=\'' + req.body.id + '\'')
	.catch(function(err){
		return next(err);
	})
});

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