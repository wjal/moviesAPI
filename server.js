/*********************************************************************************
*  BTI425 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: James Little Student ID: 028496123 Date: 3/2/2023
*  Cyclic Link: https://troubled-lamb-vestments.cyclic.app/
*
********************************************************************************/ 

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
      .json({message: 'Movies'})
});

//retrieve moveis by title (optional query), page, and perPage (both required) - working
app.get("/api/movies", (req, res)=>{
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
  .then(data=>{
    if(data == null){
      res 
        .status(204)
        .send(`No Content Found`);
    }else{
    res
      .json(data)}
    }).catch(err=>{
      res
        .status(500)
        .send(`Unable To Find Movies`);
        console.log(err);
      }
    )
})
//retrieve single movie by id parameter - working
app.get("/api/movies/:id", (req, res)=>{
  db.getMovieById(req.params.id)
  .then(data=>{
    if(data == null){
    res
      .status(204)
      .send(`No Content Found`);
      }
    else{
      res 
        .json(data)}
    }).catch(err=>{
      res
        .status(500)
        .send(`Unable To Find Movie`);
        console.log(err)
    }

    )
    
})
//add a movie object to movie database - working
app.post("/api/movies", (req, res)=>{
  db.addNewMovie(req.body)
  .then(newMovie=>{
    if(newMovie == null){
      res
        .status(204)
        .send(`Unable To Add Movie`)
    }
    res
      .status(201)
      .json(newMovie)
    }).catch(err=>{
        res
          .status(500)
          .send(`Unable To Add Movie`);
          console.log(err);
    })
});
//update single movie from movie database by id paramater - working
app.put("/api/movies/:id", (req, res)=>{
  db.updateMovieById(req.body, req.params.id)
  .then(data=>{
    if(data == null){
      res 
        .status(204)
        .send(`Unable To Edit Movie`);
    }else{
      res
        .status(201)
        .json(data)}
    }).catch(err=>{
      res
        .status(500)
        .send(`Unable To Edit Movie`);
        console.log(err)
  });
})
//delete a single movie from movie database by id parameter - working
app.delete("/api/movies/:id", (req, res)=>{
  db.deleteMovieById(req.params.id)
  .then(data=>{
    if(data == null){
      res 
        .status(204)
        .send(`Unable To Delete Movie`);
    }else{
      res
        .status(200)
        .json(data)}
    }).catch(err=>{
      res
        .status(500)
        .send(`Unable To Delete Movie`);
        console.log(err);
    });
})


app.use((req, res) => {
    res.status(404).send("Resource not found");
});


// Tell the app to start listening for requests
//connection to mongoDB Atlas is taking ~20seconds when connecting on my local machine, but is working faster on cyclic

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, httpStart);
}).catch((err)=>{
    console.log(err);
});


