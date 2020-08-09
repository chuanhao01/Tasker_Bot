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
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

// Define global var for pool
const pool = require('../../db/index').pool;

// Importing the custom model lib to test
const app = require('../../app');
const scripts = require('../../scripts/index');

describe('Integration test suite for the Back End server (Insert APIs)', function(){
    beforeEach('Init the db', function(done){
        scripts.db.dbInit(pool)
        .then(
            function(){
                done();
            }
        );
    });
    describe('Basic Problem', function(){
        describe('POST /basic/insert', function(){
            it('Basic Functionality 1', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    'data': [
                        {
                            "taskId": 0,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        }
                    ]
                })
                .end(
                    function(err, res){
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
                    }
                );
            });
            it('Basic Functionality 2', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    'data': [
                        {
                            "taskId": 0,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        },
                        {
                            "taskId": 1,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        },
                        {
                            "taskId": 2,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        }
                    ]
                })
                .end(
                    function(err, res){
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
                    }
                );
            });
            it('Reject Duplicates', function(done){
                chai.request(app)
                .post('/basic/insert')
                .type('json')
                .send({
                    'data': [
                        {
                            "taskId": 0,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        },
                        {
                            "taskId": 0,
                            "projectId": 0,
                            "dueDate": "1998/02/01",
                            "dueTime": "0000",
                            "duration": 2,
                        }
                    ]
                })
                .end(
                    function(err, res){
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
                    }
                );
            });
            // it('Basic Rejection Template', function(done){
            //     chai.request(app)
            //     .post('/basic/insert')
            //     .type('json')
            //     .send({
            //         'data': [

            //         ]
            //     })
            //     .end(
            //         function(err, res){
            //             if(err){
            //                 done(err);
            //             }
            //             // Check res code
            //             expect(res).to.have.status(409);
            //             // Checking if there was a body with a response
            //             expect(res).to.have.property('body');
            //             expect(res.body).to.have.property('error');
            //             expect(res.body).to.have.property('code');
            //             // Checking the error string and code
            //             expect(res.body.error).to.equal('Duplicate entries');
            //             expect(res.body.code).to.equal(409);
            //             done();
            //         }
            //     );
            // });
            // it('Basic Functionality Template', function(done){
            //     chai.request(app)
            //     .post('/basic/insert')
            //     .type('json')
            //     .send({
            //         'data': [

            //         ]
            //     })
            //     .end(
            //         function(err, res){
            //             if(err){
            //                 done(err);
            //             }
            //             // Check res code
            //             expect(res).to.have.status(200);
            //             // Checking if there was a body with a response
            //             expect(res).to.have.property('body');
            //             expect(res.body).to.have.property('result');
            //             const expectedResult = 'success';
            //             expect(res.body.result).to.be.equal(expectedResult);
            //             done();
            //         }
            //     );
            // });
        });
    });
});