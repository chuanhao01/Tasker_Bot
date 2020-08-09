/**
 * @fileoverview 
 * Integration test meant for making sure the API endpoints work as intended
 * These integration test are specific for insert based apis
 * These were seperated so as to make sure testing of the other apis are always against the same database
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires NPM:pg
 * @requires ../../app.js
 * @requires ../../scripts/index.js
 * 
 */

// Importing libs needed to run the test
const {Pool} = require('pg');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

// Define global var for pool
let pool;

// Importing the custom model lib to test
const app = require('../../app');
const scripts = require('../../scripts/index');

describe('Integration testing for the INSERT APIs for the backend server', function(){
    before('Generating the pool for the db used in the test', function(){
        pool = new Pool({
            connectionString: process.env.PG_URL,
            max: 5,
        });
        return;
    });
    beforeEach('Init the db', function(done){
        // For async calls to be done before the test
        scripts.db.dbInit(pool)
        .then(
            function(){
                done();
            }
        )
        .catch(done);
    });
    describe('Testing the Insert/POST API endpoints', function(){
        describe('For the Basic Problem', function(){
            describe('POST /basic/insert', function(){
                it('Testing basic functionality', function(done){
                    chai.request(app)
                    .post('/basic/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": 0,
                                "projectId": 0,
                                "dueDate": "1998/02/01",
                                "dueTime": "0000",
                                "duration": 2,
                            },
                            {
                                "taskId": 1,
                                "projectId": 1,
                                "dueDate": "2000/02/01",
                                "dueTime": "2359",
                                "duration": 1,
                            },
                            {
                                "taskId": 2,
                                "projectId": 9999999999,
                                "dueDate": "2000/02/01",
                                "dueTime": "2359",
                                "duration": 1,
                            },
                            {
                                "taskId": 9999999999,
                                "projectId": 3,
                                "dueDate": "2000/02/01",
                                "dueTime": "2359",
                                "duration": 1,
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
                it('Checking duration decimal functionality', function(done){
                    chai.request(app)
                    .post('/basic/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": 100,
                                "projectId": 0,
                                "dueDate": "1998/02/01",
                                "dueTime": "0000",
                                "duration": 2.123123,
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
                it('Checking dueTime format');
                it('Checking dueDate format');
                it('dueTime type validation', function(done){
                    chai.request(app)
                    .post('/basic/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": 4,
                                "projectId": 0,
                                "dueDate": "1998/02/01",
                                "dueTime": 0000,
                                "duration": 2,
                            },
                        ]
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
                it('Allow strings for ids and duration', function(done){
                    chai.request(app)
                    .post('/basic/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": '5',
                                "projectId": '0',
                                "dueDate": "1998/02/01",
                                "dueTime": '0000',
                                "duration": '2',
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
            });
        });
        describe('For the advanced Problem', function(){
            describe('POST /advance/insert', function(){
                it('Testing basic functionality', function(done){
                    chai.request(app)
                    .post('/advance/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": 0,
                                "projectId": 0,
                                "duration": 2,
                            },
                            {
                                "taskId": 1,
                                "projectId": 1,
                                "duration": 1,
                            },
                            {
                                "taskId": 2,
                                "projectId": 9999999999,
                                "duration": 1,
                            },
                            {
                                "taskId": 9999999999,
                                "projectId": 3,
                                "duration": 1,
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
                it('Checking duration decimal functionality', function(done){
                    chai.request(app)
                    .post('/advance/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": '100',
                                "projectId": '1',
                                "duration": '2.123123',
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
                it('Allow string for ids and duration', function(done){
                    chai.request(app)
                    .post('/advance/insert')
                    .type('json')
                    .send({
                        'data':[
                            {
                                "taskId": '3',
                                "projectId": '1',
                                "duration": '2',
                            },
                        ]
                    })
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        const expectedResult = 'success';
                        expect(res.body.result).to.be.equal(expectedResult);
                        done();
                    });
                });
            });
        });
    });
});