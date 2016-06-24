#DROP DATABASE IF EXISTS favorite_movies;
CREATE DATABASE favorite_movies;

\c favorite_movies

CREATE TABLE users(
username VARCHAR(15) PRIMARY KEY,
password VARCHAR(10) NOT NULL
);

INSERT INTO users (username, password) VALUES ('John', '12345');

CREATE TABLE favorites(
id SERIAL PRIMARY KEY,
username VARCHAR(15) REFERENCES users(username),
title TEXT NOT NULL,
imdbid VARCHAR(12) NOT NULL,
imgsrc TEXT NOT NULL,
description TEXT
);

INSERT INTO favorites (username, title, imdbid, imgsrc, description) VALUES ('John', 'Fast & Furious 6', 'tt1905041', 
	'http://ia.media-imdb.com/images/M/MV5BMTM3NTg2NDQzOF5BMl5BanBnXkFtZTcwNjc2NzQzOQ@@._V1_SX300.jpg', 
	'Hobbs has Dominic and Brian reassemble their crew to take down a team of mercenaries: Dominic unexpectedly gets convoluted also facing his presumed deceased girlfriend, Letty.');