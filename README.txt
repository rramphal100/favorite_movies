This web app uses node.js, express, and the OMDB API to allow users to search for movies and save them to a favorites list.

First, clone this repository into your desired site root folder.

Then, use the command:
npm install pg-promise express hbs bluebird body-parser path --save
This allows you to install all the necessary dependencies for this site to work.

To run this app, install all of the node modules specified in the package.json file. Then type node app to start the web server.

Note that this app requires a connection to a specifically configured PostgreSQL server.

You must run the config.sql file on your PostgreSQL server to get your database ready for hosting this web app.

To do so, in your client's CLI, enter the following command:
psql -f config.sql
You may need to add arguments to this depending of if you want to use a server username (-U or --username), hostname (-h or --host), port (-p or --port), etc other than your client's default values for those fields.

WARNING: The first line is commented out to prevent you from accidentally deleting any of your databases! Uncomment this line if you are certain that you want your existing database dropped!

Next Steps and Challenges:

Improve session management and user account creation handling.

Add ability to type custom notes for each saved movie.

Give users ability to leave IMDB comments on movies from within this site.

Link to movie trailers for each movie in the search results and favorites lists.