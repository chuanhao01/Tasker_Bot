/**
 * @fileoverview 
 * The main file to import to get access to the custom utils functions
 * This file will export a js object with access to rest of the models
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires ./dbParser.js
 * @requires ./validator.js
 * @requires ./dataParser
 * 
 */

// Importing the other utils modules
const dbParser = require('./dbParser');
const validator = require('./validator');
const dataParser = require('./dataParser');

/**
 * @module utils
 * This will be the main obj holding all the util functions and the main interface/namespace to access them
 * 
 */
 const utils = {
   dbParser,
   v: validator,
   dataParser,
 };

 module.exports = utils;