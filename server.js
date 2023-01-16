const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const on_http = function(){
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
        .json({message: "API Listening"});
  });


  app.use((req, res) => {
    res.status(404).send("Resource not found");
  });
  
  // Tell the app to start listening for requests
  app.listen(HTTP_PORT, on_http);

