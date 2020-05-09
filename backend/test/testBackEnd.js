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
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

// Importing own modules
const app = require('../app');

describe('Backend Test', function(){
    describe('Testing for basic controllers', function(){
        describe('Testing the validation of bulk insert', function(){
            it('Empty data', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({})
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(400);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Invalid data format');
                    expect(res.body.code).to.equal(400);
                    done();
                });
            });
            it('Empty data arr', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    data: [],
                })
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(400);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Invalid data format');
                    expect(res.body.code).to.equal(400);
                    done();
                });
            });
            it('Data arr with empty obj', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    data: [{}],
                })
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(400);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Invalid data format');
                    expect(res.body.code).to.equal(400);
                    done();
                });
            });
            it('Data arr with empty values', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    data: [{
                        'taskId': '',
                        'projectId': '',
                        'dueDate': '',
                        'dueTime': '',
                        'duration': '',
                    }],
                })
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(400);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Invalid data format');
                    expect(res.body.code).to.equal(400);
                    done();
                });
            });
            it('Wrong format all insert keys', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    data: [{
                        'taskId': -1,
                        'projectId': 10000000000,
                        'dueDate': '1999-11-01',
                        'dueTime': '12:11',
                        'duration': 0,
                    }],
                })
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(400);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Invalid data format');
                    expect(res.body.code).to.equal(400);
                    done();
                });
            });
            it('Duplicate taskId when doing bulk insert', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    data: [
                        {
                            "taskId": 11,
                            "projectId": 11,
                            "dueDate": "1998/02/01",
                            "dueTime": "1307",
                            "duration": 2,
                        },
                        {
                            "taskId": 11,
                            "projectId": 11,
                            "dueDate": "1998/02/02",
                            "dueTime": "0132",
                            "duration": 22,
                        }
                    ],
                })
                .end(function(err, res){
                    if(err){
                        done(err);
                    }
                    // Check res code
                    expect(res).to.have.status(409);
                    // Checking if there was a body with a response
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('error');
                    expect(res.body).to.have.property('code');
                    // Checking the error string and code
                    expect(res.body.error).to.equal('Duplicate entries');
                    expect(res.body.code).to.equal(409);
                    done();
                });
            });
        });
    });
});