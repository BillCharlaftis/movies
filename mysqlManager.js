"use strict";
var mysql = require("mysql");

module.exports = class database {
  constructor() {
    this.con = mysql.createConnection({
      connectionLimit: 100,
      // host: '10.156.0.3',
      host     : '35.198.175.119',
      port: 3306,
      user: 'root',
      password: 'pmqfwHDqG6Dd',
      database: 'movies',
    });
  }

  checkConnection() {
    this.con.connect(function(err) {
      if (err) {
        console.log(JSON.stringify(err));
      }
    });
  }

  getAllFromMovies() {
    this.con.query("SELECT * FROM movies", function(err, result, fields) {
      if (err) {
        console.log(JSON.stringify(err));
      }
      return result;
    });
  }

  getMovieIdFromMovies(movieId) {
    this.con.query("SELECT " + movieId + " FROM movies", function(err, result, fields) {
      if (err) {
        console.log(JSON.stringify(err));
      }
      return result;
    });
  }
};
