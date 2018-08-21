"use strict";
const express = require('express');
const app = express();
var db = require("./mysqlManager.js");

var server = app.listen(8011, function() {
  console.log("Server started on port " + server.address().port + " on " + Date());
  this.database = new db();
  this.database.checkConnection();
  
});

app.get('/', function(req, res) {
  res.sendFile('view/itp17210.html', {
    root: "./"
  })
});

app.get('/itp17210.js', function(req, res) {
  res.sendFile('view/itp17210.js', {
    root: "./"
  })
});

app.get('/movie/:id', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  movies.find(req.params.id, function(err, movie) {
    if (err) { //if err is set it means that the movie was not found, pass that detail to the response
      res.status(404).send(err.message);
    } else { //all's good, send response
      res.end(JSON.stringify(movie));
    }
  });
});

app.get('/ratings/:id', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  movies.find(req.params.id, function(err, movie) {
    if (err) { //if err is set it means that the movie was not found, pass that detail to the response
      res.status(404).send(err.message);
    } else { //all's good, send response
      res.end(JSON.stringify(movie));
    }
  });
});
