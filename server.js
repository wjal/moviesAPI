const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const req = require('express/lib/request');
const { stringify } = require('querystring');
const db = new MoviesDB();


const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const httpStart = function(){
  console.log("Ready to handle requests on port " + HTTP_PORT);
}

/***************************************************************/
/****                      MIDDLEWARE                 ****/
/***************************************************************/


app.use(express.json()); // built-in body-parser

app.use(cors());


/***************************************************************/
/****                      CRUD operations                  ****/
/***************************************************************/

app.get("/", (req,res) => {
    res
      .status(200)
      .json({message: "Connection succesful"});
});

//retrieve moveis by title (optional query), page, and perPage (both required) - working
app.get("/api/movies", (req, res)=>{
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
  .then(data=>{
    res
      .json(data)})
})
//retrieve single movie by id parameter - working
app.get("/api/movies/:id", (req, res)=>{
  db.getMovieById(req.params.id)
  .then(data=>{
    if(data != null){
    res
      .status(200)
      .json(data)}
    })
    
})
//add a movie object to movie database - working
app.post("/api/movies", (req, res)=>{
  db.addNewMovie(req.body)
  .then(newMovie=>{
    res
      .status(201)
      .json(newMovie)
    })
});
//update single movie from movie database by id paramater - working
app.put("/api/movies/:id", (req, res)=>{
  db.updateMovieById(req.body, req.params.id)
  .then(data=>{
    res
    .status(201)
    .json(data)
  });
})
//delete a single movie from movie database by id parameter - working
app.delete("/api/movies/:id", (req, res)=>{
  db.deleteMovieById(req.params.id)
  .then(data=>{
  res
    .status(200)
    .json(data)});
})


app.use((req, res) => {
    res.status(404).send("Resource not found");
});


// Tell the app to start listening for requests
//connection to mongoDB Atlas is taking ~20seconds when connecting on my local machine
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, httpStart);
}).catch((err)=>{
    console.log(err);
});


