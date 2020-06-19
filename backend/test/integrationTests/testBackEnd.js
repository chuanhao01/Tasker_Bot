/**
 * @fileoverview 
 * Integration test meant for making sure the API endpoints work as intended
 * To also make sure that given th db setup as it is, it works
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires NPM:pg
 * @requires ../../app.js
 * @requires ../../scripts/index.js
 * @requires ../../db/index.js
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
const model = require('../../db/index');

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
    before('Placing in mock data', function(done){
        // For async calls to be done before the test
        // Need to check if this should be passed along with the whole test suite
        if(process.env.NODE_ENV !== 'INT_TEST'){
            this.skip();
        }
        const dummyTasks = [
            "(1, 11, '1998-02-02', '01:32:00', 2)",
            "(2, 11, '1998-02-02', '01:32:00', 2)",
            "(3, 11, '1998-02-02', '01:32:00', 2)",
            "(4, 11, '1998-02-02', '01:32:00', 2)",
            "(5, 11, '1998-02-02', '01:32:00', 2)",
            "(6, 11, '1998-02-02', '01:32:00', 2)",
            "(7, 11, '1998-02-02', '01:32:00', 2)",
            "(8, 11, '1998-02-02', '01:32:00', 2)",
            "(9, 11, '1998-02-02', '01:32:00', 2)",
            "(10, 11, '1998-02-02', '01:32:00', 2)"
        ];
        new Promise((resolve) => {
            resolve(
                model.basic.insertTask(dummyTasks)
                .catch(
                    function(err){
                        done(err);
                    }
                )
            );
        })
        .then(
            function(){
                done();
            }
        )
        .catch(done);
    });
    describe('Testing the API endpoints', function(){
        describe('For the Basic Problem', function(){
            describe('GET /basic/data', function(){
                it('Checking normal request', function(done){
                    chai.request(app)
                    .get('/basic/data?pageNum=3&page=1')
                    .send()
                    .end(function(err, res){
                        if(err){
                            done(err);
                        }
                        // Check res code
                        expect(res).to.have.status(200);
                        // Checking if there was a body with a response
                        expect(res).to.have.property('body');
                        expect(res.body).to.have.property('result');
                        expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                        // Checking the body specific data
                        const expectedData = [
                            {
                                taskid: 1,
                                duedate: '1998/02/02',
                                duetime: '0132',
                                duration: 2,
                                projectid: 11
                            },
                            {
                                taskid: 2,
                                duedate: '1998/02/02',
                                duetime: '0132',
                                duration: 2,
                                projectid: 11
                            },
                            {
                                taskid: 3,
                                duedate: '1998/02/02',
                                duetime: '0132',
                                duration: 2,
                                projectid: 11
                            }
                        ];
                        const expectedLastPage = 4;
                        expect(JSON.stringify(res.body.result.data)).to.be.equal(JSON.stringify(expectedData));
                        expect(JSON.stringify(res.body.result.lastPage)).to.be.equal(JSON.stringify(expectedLastPage));
                        done();
                    });
                });
            });
        });
    });
});