/**
 * @fileoverview 
 * The main file to import to get access to the db models in JS.
 * This file will export a js object with access to rest of the models
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:moment
 * @requires ./basic.js
 * @requires ./advanced.js
 * 
 */

// Setting up date parser for pg
var types = require('pg').types;
var moment = require('moment');
// Setting up custom parsing for datatypes
// For the DATE data type
types.setTypeParser(1082, function(val) {
    return val === null ? null : moment(val, 'YYYY-MM-DD');
});
// For the DECIMAL data type
types.setTypeParser(1700, parseFloat);
// For the FLOAT data type
types.setTypeParser(701, parseFloat);

//  Importing the pg lib
const {Pool} = require('pg');

// Generating the pool obj to connect to the database
const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

// Importing all the custom models for basic and advanced
const basicDB = require('./basicDB');
basicDB.init(pool);

const advancedDB = require('./advancedDB');
advancedDB.init(pool);

/**
 * @module model 
 * This will be the main object holding all the models used for the DB
 * 
 */
const model = {
    basic: basicDB,
    advanced: advancedDB,
    pool: pool
};

module.exports = model;

