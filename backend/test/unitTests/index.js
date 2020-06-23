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

const { expect } = require('chai');

// Loading dotenv for the test
before('Making sure dotenv is loaded', function(){
    require('dotenv').config();
    expect(process.env.NODE_ENV).to.equal('UNIT_TEST', 'Env Var is not set properly');
});