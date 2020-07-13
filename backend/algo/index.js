/**
 * @fileoverview 
 * The main module to be exported to gain access to the algos to calculate the needed results
 * 
 * @author Lim Chuan Hao
 * 
 * @requires ./basicAlgo.js
 * 
 */

// Importing the modules to be packaged
const basicAlgo = require('./basicAlgo');

// Creating the main obj to export
const algo = {
    basic: basicAlgo
};

module.exports = algo;