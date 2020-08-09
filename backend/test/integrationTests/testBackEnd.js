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

describe('Integration test suite for the Back End server (Non-insert APIs)', function(){
    before('Init the db', function(done){
        // For async calls to be done before the test
        // Making sure the db is initialized
        scripts.db.dbInit(pool)
        .then(
            // Inserting dummy basic tasks
            function(){
                return new Promise((resolve, reject) => {
                    const dummyBasicTasks = `(1, 11, '1998-02-02', '01:32:00', 2),
                    (2, 11, '1998-02-02', '01:32:00', 2),
                    (3, 11, '1998-02-02', '01:32:00', 3),
                    (4, 11, '1998-02-02', '01:32:00', 3),
                    (5, 11, '1998-02-02', '01:32:00', 4),
                    (6, 11, '1998-02-02', '01:32:00', 4),
                    (7, 11, '1998-02-02', '01:32:00', 2),
                    (8, 11, '1998-02-02', '01:32:00', 2),
                    (9, 11, '1998-02-02', '01:32:00', 2),
                    (10, 12, '1998-02-02', '01:32:00', 2),
                    (11, 12, '1998-02-02', '01:32:00', 2),
                    (12, 12, '1998-02-02', '01:32:00', 2),
                    (13, 13, '1998-02-02', '01:32:00', 2),
                    (14, 14, '1998-02-02', '01:32:00', 5),
                    (15, 11, '1998-02-02', '01:32:00', 2),
                    (16, 11, '1998-02-02', '01:32:00', 2.0),
                    (17, 11, '1998-02-02', '01:32:00', 1.911),
                    (18, 11, '1998-02-02', '01:32:00', 2),
                    (19, 11, '1998-02-02', '01:32:00', 2),
                    (20, 11, '1998-02-02', '01:32:00', 2),
                    (21, 11, '1998-02-02', '01:32:00', 2),
                    (1000000001, 1100000001, '2020-01-01', '11:00:00', 1),
                    (1000000002, 1100000001, '2020-01-01', '11:00:00', 1),
                    (1000000003, 1100000001, '2020-01-01', '11:00:00', 1),
                    (1000000004, 1100000001, '2020-01-01', '11:00:00', 1),
                    (1000000005, 1100000002, '2020-01-01', '14:00:00', 1),
                    (1000000006, 1100000002, '2020-01-01', '14:00:00', 2),
                    (1000000007, 1100000002, '2020-01-01', '14:00:00', 3),
                    (1000000008, 1100000002, '2020-01-01', '14:00:00', 4),
                    (1000000009, 1100000003, '2020-01-01', '11:00:00', 1),
                    (1000000010, 1100000003, '2020-01-01', '13:00:00', 3),
                    (1000000011, 1100000003, '2020-01-01', '15:00:00', 5),
                    (1000000012, 1100000003, '2020-01-01', '17:00:00', 7),
                    (1000000013, 1100000004, '2020-01-01', '12:00:00', 1),
                    (1000000014, 1100000004, '2020-01-01', '14:00:00', 4),
                    (1000000015, 1100000004, '2020-01-01', '19:00:00', 7),
                    (1000000016, 1100000004, '2020-01-01', '15:00:00', 7),
                    (1000000017, 1100000004, '2020-01-01', '19:00:00', 11)
                    `;
                    pool.query(`
                    INSERT INTO TASKSBASIC
                    (taskID, projectId, dueDate, dueTime, duration)
                    VALUES
                    ${dummyBasicTasks}
                    `, function(err){
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve();
                        return;
                    });
                });
            }
        )
        .then(
            // Inserting dummy advanced tasks
            function(){
                new Promise((resolve, reject) => {
                    const dummyAdvancedTasks = `(1, 1, 3),
                    (2, 1, 3),
                    (3, 1, 3),
                    (4, 1, 3),
                    (5, 1, 3),
                    (6, 1, 3),
                    (7, 1, 3),
                    (8, 1, 3),
                    (9, 1, 3),
                    (10, 11, 3),
                    (11, 11, 3),
                    (12, 12, 3),
                    (13, 12, 1.211),
                    (14, 12, 3),
                    (15, 12, 3),
                    (16, 13, 3),
                    (17, 14, 3),
                    (18, 1, 4),
                    (19, 1, 4),
                    (20, 1, 5),
                    (21, 1, 3),
                    (22, 2, 1.41),
                    (23, 2, 2.141),
                    (24, 2, 1.76),
                    (25, 2, 4.91),
                    (26, 2, 3.611),
                    (101, 101, 3),
                    (102, 101, 3),
                    (103, 101, 3),
                    (104, 102, 3),
                    (105, 102, 3),
                    (106, 102, 4);
                    `;
                    pool.query(`
                    INSERT INTO TASKSADVANCED
                    (taskId, projectId, duration)
                    VALUES
                    ${dummyAdvancedTasks}
                    `, function(err){
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve();
                        return;
                    });
                });
                return;
            }
        )
        .then(
            // If everything is set up properly
            function(){
                done();
            }
        )
        .catch(done);
    });
    describe('Testing the API endpoints', function(){
        describe('Basic Problem', function(){
            describe('GET /basic/data', function(){
                it('Basic Functionality', function(done){
                    chai.request(app)
                    .get('/basic/data')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 1
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 2
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 3,
                                            "projectId": 11,
                                            "taskId": 3
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 3,
                                            "projectId": 11,
                                            "taskId": 4
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 4,
                                            "projectId": 11,
                                            "taskId": 5
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 4,
                                            "projectId": 11,
                                            "taskId": 6
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 7
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 8
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 9
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 12,
                                            "taskId": 10
                                        }
                                    ],
                                    "lastPage": 4
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
                it('projectId Filter Only', function(done){
                    chai.request(app)
                    .get('/basic/data?projectId[=]=11')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 1
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 2
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 3,
                                            "projectId": 11,
                                            "taskId": 3
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 3,
                                            "projectId": 11,
                                            "taskId": 4
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 4,
                                            "projectId": 11,
                                            "taskId": 5
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 4,
                                            "projectId": 11,
                                            "taskId": 6
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 7
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 8
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 9
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 15
                                        }
                                    ],
                                    "lastPage": 2
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
                it('duration Filter Only', function(done){
                    chai.request(app)
                    .get('/basic/data?duration[<]=2')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 1.911,
                                            "projectId": 11,
                                            "taskId": 17
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000001,
                                            "taskId": 1000000001
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000001,
                                            "taskId": 1000000002
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000001,
                                            "taskId": 1000000003
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000001,
                                            "taskId": 1000000004
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1400",
                                            "duration": 1,
                                            "projectId": 1100000002,
                                            "taskId": 1000000005
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000003,
                                            "taskId": 1000000009
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1200",
                                            "duration": 1,
                                            "projectId": 1100000004,
                                            "taskId": 1000000013
                                        }
                                    ],
                                    "lastPage": 1
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
                it('sortBy Filter Only', function(done){
                    chai.request(app)
                    .get('/basic/data?sortBy=projectId.desc')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1900",
                                            "duration": 11,
                                            "projectId": 1100000004,
                                            "taskId": 1000000017
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1400",
                                            "duration": 4,
                                            "projectId": 1100000004,
                                            "taskId": 1000000014
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1900",
                                            "duration": 7,
                                            "projectId": 1100000004,
                                            "taskId": 1000000015
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1500",
                                            "duration": 7,
                                            "projectId": 1100000004,
                                            "taskId": 1000000016
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1200",
                                            "duration": 1,
                                            "projectId": 1100000004,
                                            "taskId": 1000000013
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1700",
                                            "duration": 7,
                                            "projectId": 1100000003,
                                            "taskId": 1000000012
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1500",
                                            "duration": 5,
                                            "projectId": 1100000003,
                                            "taskId": 1000000011
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1300",
                                            "duration": 3,
                                            "projectId": 1100000003,
                                            "taskId": 1000000010
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1100",
                                            "duration": 1,
                                            "projectId": 1100000003,
                                            "taskId": 1000000009
                                        },
                                        {
                                            "dueDate": "2020/01/01",
                                            "dueTime": "1400",
                                            "duration": 2,
                                            "projectId": 1100000002,
                                            "taskId": 1000000006
                                        }
                                    ],
                                    "lastPage": 4
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
                it('page Only', function(done){
                    chai.request(app)
                    .get('/basic/data?page=2')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                        "data": [
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 12,
                                                "taskId": 11
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 12,
                                                "taskId": 12
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 13,
                                                "taskId": 13
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 5,
                                                "projectId": 14,
                                                "taskId": 14
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 11,
                                                "taskId": 15
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 11,
                                                "taskId": 16
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 1.911,
                                                "projectId": 11,
                                                "taskId": 17
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 11,
                                                "taskId": 18
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 11,
                                                "taskId": 19
                                            },
                                            {
                                                "dueDate": "1998/02/02",
                                                "dueTime": "0132",
                                                "duration": 2,
                                                "projectId": 11,
                                                "taskId": 20
                                            }
                                        ],
                                        "lastPage": 4
                                    }
                                            };
                                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                                    done();
                                }
                    );
                });
                it('pageNum Only', function(done){
                    chai.request(app)
                    .get('/basic/data?pageNum=3')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 1
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 2,
                                            "projectId": 11,
                                            "taskId": 2
                                        },
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 3,
                                            "projectId": 11,
                                            "taskId": 3
                                        }
                                    ],
                                    "lastPage": 13
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
                it('Expected Functionality', function(done){
                    chai.request(app)
                    .get('/basic/data?projectId[=]=11&duration[>]=2&sortBy=projectId.desc&page=2&pageNum=3')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedRes = {
                                "result": {
                                    "data": [
                                        {
                                            "dueDate": "1998/02/02",
                                            "dueTime": "0132",
                                            "duration": 4,
                                            "projectId": 11,
                                            "taskId": 6
                                        }
                                    ],
                                    "lastPage": 2
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedRes));
                            done();
                        }
                    );
                });
            });
            describe('GET /basic/result', function(){
                it('Basic Functionality 1', function(done){
                    chai.request(app)
                    .get('/basic/result?projectId=1100000001&startTime=0900&startDate=2020/01/01')
                    .send()
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
                            expect(res.body).to.have.property('totalLateness');
                            const expectedBody = {
                                "result": [
                                    {
                                        "taskId": 1000000001,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1100",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "0900",
                                        "toDate": "2020/01/01",
                                        "toTime": "1000",
                                        "lateness": 0
                                    },
                                    {
                                        "taskId": 1000000002,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1100",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1000",
                                        "toDate": "2020/01/01",
                                        "toTime": "1100",
                                        "lateness": 0
                                    },
                                    {
                                        "taskId": 1000000003,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1100",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1100",
                                        "toDate": "2020/01/01",
                                        "toTime": "1200",
                                        "lateness": 1
                                    },
                                    {
                                        "taskId": 1000000004,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1100",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1200",
                                        "toDate": "2020/01/01",
                                        "toTime": "1300",
                                        "lateness": 2
                                    }
                                ],
                                "totalLateness": 3
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('Basic Functionality 2', function(done){
                    chai.request(app)
                    .get('/basic/result?projectId=1100000002&startTime=0900&startDate=2020/01/01')
                    .send()
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
                            expect(res.body).to.have.property('totalLateness');
                            const expectedBody = {
                                "result": [
                                    {
                                        "taskId": 1000000005,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1400",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "0900",
                                        "toDate": "2020/01/01",
                                        "toTime": "1000",
                                        "lateness": 0
                                    },
                                    {
                                        "taskId": 1000000006,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1400",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1000",
                                        "toDate": "2020/01/01",
                                        "toTime": "1200",
                                        "lateness": 0
                                    },
                                    {
                                        "taskId": 1000000007,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1400",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1200",
                                        "toDate": "2020/01/01",
                                        "toTime": "1500",
                                        "lateness": 1
                                    },
                                    {
                                        "taskId": 1000000008,
                                        "deadlineDate": "2020/01/01",
                                        "deadlineTime": "1400",
                                        "fromDate": "2020/01/01",
                                        "fromTime": "1500",
                                        "toDate": "2020/01/01",
                                        "toTime": "1900",
                                        "lateness": 5
                                    }
                                ],
                                "totalLateness": 6
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                // it('Basic Functionality template', function(done){
                //     chai.request(app)
                //     .get('/basic/result?projectId=1100000001&startTime=0900&startDate=2020/01/01')
                //     .send()
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
                //             expect(res.body).to.have.property('totalLateness');
                //             const expectedBody = {

                //             };
                //             expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                //             done();
                //         }
                //     );
                // }).skip();
                // it('Template for error', function(done){
                //     chai.request(app)
                //     .get('/basic/result')
                //     .send()
                //     .end(
                //         function(err, res){
                //             if(err){
                //                 done(err);
                //             }
                //             // Check res code
                //             expect(res).to.have.status(400);
                //             // Checking if there was a body with a response
                //             expect(res).to.have.property('body');
                //             expect(res.body).to.have.property('error');
                //             expect(res.body).to.have.property('code');
                //             expect(res.body.error).to.be.equal('Wrong syntax for query params');
                //             expect(res.body.code).to.be.equal(400);
                //             done();
                //         }
                //     );
                // }).skip();
            });
        });
        describe('Advanced Problem', function(){
            describe('GET /advance/data', function(){
                it('Default Functionality', function(done){
                    chai.request(app)
                    .get('/advance/data')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 1,
                                            "taskId": 1,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 2,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 3,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 4,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 5,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 6,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 7,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 8,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 9,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 11,
                                            "taskId": 10,
                                            "duration": 3
                                        }
                                    ],
                                    "lastPage": 4
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('projectId Filter Only', function(done){
                    chai.request(app)
                    .get('/advance/data?projectId[=]=1')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 1,
                                            "taskId": 1,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 2,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 3,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 4,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 5,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 6,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 7,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 8,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 9,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 18,
                                            "duration": 4
                                        }
                                    ],
                                    "lastPage": 2
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('duration Filter Only', function(done){
                    chai.request(app)
                    .get('/advance/data?duration[<]=2')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 12,
                                            "taskId": 13,
                                            "duration": 1.211
                                        },
                                        {
                                            "projectId": 2,
                                            "taskId": 22,
                                            "duration": 1.41
                                        },
                                        {
                                            "projectId": 2,
                                            "taskId": 24,
                                            "duration": 1.76
                                        }
                                    ],
                                    "lastPage": 1
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('sortBy Filter only', function(done){
                    chai.request(app)
                    .get('/advance/data?sortBy=projectId.desc')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 102,
                                            "taskId": 105,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 102,
                                            "taskId": 104,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 102,
                                            "taskId": 106,
                                            "duration": 4
                                        },
                                        {
                                            "projectId": 101,
                                            "taskId": 101,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 101,
                                            "taskId": 102,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 101,
                                            "taskId": 103,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 14,
                                            "taskId": 17,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 13,
                                            "taskId": 16,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 14,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 12,
                                            "duration": 3
                                        }
                                    ],
                                    "lastPage": 4
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('page Only', function(done){
                    chai.request(app)
                    .get('/advance/data?page=2')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 11,
                                            "taskId": 11,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 12,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 13,
                                            "duration": 1.211
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 14,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 12,
                                            "taskId": 15,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 13,
                                            "taskId": 16,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 14,
                                            "taskId": 17,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 18,
                                            "duration": 4
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 19,
                                            "duration": 4
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 20,
                                            "duration": 5
                                        }
                                    ],
                                    "lastPage": 4
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('pageNum Filter Only', function(done){
                    chai.request(app)
                    .get('/advance/data?pageNum=3')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 1,
                                            "taskId": 1,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 2,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 1,
                                            "taskId": 3,
                                            "duration": 3
                                        }
                                    ],
                                    "lastPage": 11
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                it('Expected Functionality', function(done){
                    chai.request(app)
                    .get('/advance/data?projectId[>]=7&duration[>]=2&sortBy=projectId.desc&page=2&pageNum=3')
                    .send()
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
                            expect(res.body.result).to.have.all.keys(['data', 'lastPage']);
                            const expectedBody = {
                                "result": {
                                    "data": [
                                        {
                                            "projectId": 101,
                                            "taskId": 103,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 101,
                                            "taskId": 101,
                                            "duration": 3
                                        },
                                        {
                                            "projectId": 101,
                                            "taskId": 102,
                                            "duration": 3
                                        }
                                    ],
                                    "lastPage": 5
                                }
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                // it('Basic Functionality template', function(done){
                //     chai.request(app)
                //     .get('/advance/data')
                //     .send()
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
                //             expect(res.body).to.have.property('totalLateness');
                //             const expectedBody = {

                //             };
                //             expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                //             done();
                //         }
                //     );
                // }).skip();
            });
            describe('GET /advance/result', function(){
                it('Equal Split (INT) Basic Functionality 1', function(done){
                    chai.request(app)
                    .get('/advance/result?projectId=11')
                    .send()
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
                            const expectedBody = {
                                "result": [
                                    [
                                        {
                                            "projectId": 11,
                                            "taskId": 11,
                                            "duration": 3
                                        }
                                    ],
                                    [
                                        {
                                            "projectId": 11,
                                            "taskId": 10,
                                            "duration": 3
                                        }
                                    ]
                                ]
                            };
                            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                            done();
                        }
                    );
                });
                // it('Equal Split (INT) Basic Functionality 2', function(done){
                //     chai.request(app)
                //     .get('/advance/result?projectId=2')
                //     .send()
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
                //             const expectedBody = {

                //             };
                //             expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                //             done();
                //         }
                //     );
                // });
                // it('Basic Functionality template', function(done){
                //     chai.request(app)
                //     .get('/advance/result')
                //     .send()
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
                //             const expectedBody = {

                //             };
                //             expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(expectedBody));
                //             done();
                //         }
                //     );
                // }).skip();
            });
        });
    });
});