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

// Loading dotenv for the test
before('Making sure dotenv is loaded', function(){
    require('dotenv').config();
});

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

describe('Integration testing for the whole backend server', function(){
    before('Checking env', function(){
        if(process.env.NODE_ENV === 'INT_TEST'){
            // If the test env is set up, continue to do normal setup
            // Generating the pool obj to connect to the database
            pool = new Pool({
                connectionString: process.env.PG_URL,
                max: 5,
            });
            return;
        }
        else{
            this.skip();
        }
    });
    before('Init the db', function(done){
        // For async calls to be done before the test
        // Need to check if this should be passed along with the whole test suite
        if(process.env.NODE_ENV !== 'INT_TEST'){
            this.skip();
        }
        // If the env is set up properly, run the init script
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
            });
        });
    });
});