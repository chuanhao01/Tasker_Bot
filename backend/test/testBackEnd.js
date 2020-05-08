/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires ../app.js
 * 
 */

// Importing the npm testing lib
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const should = require('chai').should();

// Importing own modules
const app = require('../app');

describe('Backend Test', function(){
    describe('Testing for basic controllers', function(){
        
    });
});

chai.request(app)
.post('/basic/insert')
.type('form')
.send({
    data: ['hello'],
})
.end(function(err, res){
    if(err){
        console.log(err);
        return;
    }
    console.log(res.status);
});