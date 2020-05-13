/**
 * @fileoverview 
 * The main file to import to get access to the scripts used.
 * This is most likely used with testing, and will act as an inteface to the scripts needed.
 * 
 * @author Lim Chuan Hao
 * 
 * @requires ./dbScript
 * 
 */

// Importing the other custom modules needed
const dbScripts = require('./dbScripts');


/**
 * @module scripts
 * This will be the main obj holding all the scripts
 * 
 */
const scripts = {
    db: dbScripts,
};

module.exports = scripts;