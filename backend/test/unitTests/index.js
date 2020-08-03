/**
 * @fileoverview 
 * This is meant to the config file to set up and make sure things like env vars are loaded  properly before the tests
 * 
 * @author Lim Chuan Hao
 * 
 * @requires dotenv
 * @requires chai
 * 
 */


require('dotenv').config();
// Loading dotenv for the test
before('Making sure dotenv is loaded', function(){
    // Loading the testing libs
    const { expect } = require('chai');

    // Loading the dot env vars
    require('dotenv').config();

    // Checking if the env is set up properly
    expect(process.env.NODE_ENV).to.equal('UNIT_TEST', 'Env Var is not set properly');
});