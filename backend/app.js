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

// Setting up express and app
const express = require('express');
const app = express();

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

// Setting up ports
const PORT  = 3000;
app.listen(PORT, function(){
    console.log(`Server listening at port ${PORT}`);
});

// Exporting the express app obj for testing purposes
module.exports = app;