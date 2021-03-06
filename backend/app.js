/**
 * @fileoverview 
 * This is the main file for running the back-end server
 * All the controllers and middlewares are called from here
 * 
 * @author Lim Chuan Hao
 * 
 * @requires add later
 * 
 */

// Getting env setup using the dotenv module
require('dotenv').config();

// Setting up express and app
const express = require('express');
const app = express();

// Adding CORS
const cors = require('cors');
app.use(cors());

// Setting up body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting up middlewares
// const middlewares = require('./middlewares/index');
// middlewares.init(app);

// Setting up controllers
const controllers = require('./controllers/index');
controllers.init(app);

// Setting up lost route handler
app.use(function(req, res, next){
    res.status(404).send({
        'page': 'not found'
    });
});

// Setting up ports
const PORT  = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log(`Server listening at port ${PORT}`);
});

// Exporting the express app obj for testing purposes
module.exports = app;
