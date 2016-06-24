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

//get all users / render home page
app.get("/", function(req, res, next){
	db.any("SELECT * FROM users")
	.then(function(users){
		res.render("index", {users: users});
	})
	.catch(function(err){
		return next(err);
	});
});

//display a single user's favorites page
app.get("/users/:name", function(req,res,next){
	db.any('SELECT * FROM favorites WHERE username=$1', req.params.name)
	.then(function(movies){
		res.render('user', {username: req.params.name, movies: movies});
	})
	.catch(function(err){
		return next(err);
	});
});

//login page
app.get("/login", function(req,res,next){
	res.render('login');
});

//a single user's search page
app.get("/search/:name", function(req,res){
	res.render("search", {username: req.params.name});
});

//add a movie from a user's search page to his/her favorites list
app.post('/savedata', function(req,res,next){
	var id=req.body.id;
	var title=req.body.title;
	db.any('SELECT * FROM favorites WHERE imdbid=\'' + id + '\' AND username=\'' + req.body.username + '\'')
	.then(function(movie){
		console.log(movie[0]);
		if(movie[0] == undefined){
			db.none('INSERT INTO favorites (username, title, imdbid, description, imgsrc) VALUES (\'' + req.body.username
			+ '\', \'' + title + '\', \'' + id + '\', \'' + req.body.description + '\', \'' + req.body.poster + '\')')
			.catch(function(error){
				return next(error);
			})
		}
		else if(title == ''){
			res.redirect('/search/' + req.body.username);
		}
	})
	.catch(function(err){
		return next(err);
	});
	res.redirect('/search/' + req.body.username);
});

//delete a movie from a user's favorites list
app.post('/delete/:id', function(req,res,next){
	db.none('DELETE FROM favorites WHERE username=\'' + req.body.username + '\' AND imdbid=\'' + req.params.id + '\'')
	.catch(function(err){
		return next(err);
	});
	res.redirect('/users/' + req.body.username);
});

//login verification
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

//send a simple login error page if invalid credentials supplied
app.get('/loginerror', function(req,res){
	res.send("<center><h1>Error! Invalid Login</h1><p>Click <a href='/login'>here</a> to return to the login page.</p></center>");
});

//signup page
app.get('/signup', function(req,res,next){
	res.render('signup');
});

//create new user in database
app.post('/signup', function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var confirm = req.body.confirm;
	db.any('SELECT * FROM users WHERE username=\'' + username + '\'')
	.then(function(users){
		if(users[0] == undefined){
			if(password == confirm){
				db.none('INSERT INTO users (username, password) VALUES (\'' + username + '\', \'' + password + '\')')
				.catch(function(err){
					return next(err);
				});
				res.redirect('/login');
			}
			else{
				res.redirect('/signup');
			}
		}
		else{
			res.redirect('/signup');
		}
	})
	.catch(function(err){
		return next(err);
	});
});

//run the web server on port 3000
app.listen(3000, function(){
	console.log("Favorite Movies app listening on port 3000.");
});