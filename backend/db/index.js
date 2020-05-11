/**
 * @fileoverview 
 * The main file to import to get access to the db models in JS.
 * This file will export a js object with access to rest of the models
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires ./basic.js
 * @requires ./advanced.js
 * 
 */

//  Importing the pg lib
const {Pool} = require('pg');

// Generating the pool obj to connect to the database
const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

// Importing all the custom models for basic and advanced
const basic_db = require('./basicDB');
basic_db.init(pool);

/**
 * @module model 
 * This will be the main object holding all the models used for the DB
 * 
 */
const model = {
    basic: basic_db
};

module.exports = model;

