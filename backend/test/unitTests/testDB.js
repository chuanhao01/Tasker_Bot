/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * @requires dotenv
 * @require rewire
 * @requires ../../db/index.js
 * @requires ../../scripts/index.js
 * 
 */

// Setting up date parser for pg
var types = require('pg').types;
var moment = require('moment');
// Setting up custom parsing for datatypes
// For the DATE data type
types.setTypeParser(1082, function(val) {
    return val === null ? null : moment(val, 'YYYY-MM-DD');
});
// For the DECIMAL data type
types.setTypeParser(1700, parseFloat);
// For the FLOAT data type
types.setTypeParser(701, parseFloat);

// Importing libs needed to run the test
const {Pool} = require('pg');
const expect = require('chai').expect;
const rewire = require('rewire');

// Importing the db/model to test
const model = rewire('../../db/index');

// Define global var for pool
let pool;

// Importing the script to run and test as well
const scripts = require('../../scripts/index');

describe('Model Test Suite', function(){
    before('Setting up the pool for the db test', function(){
        // Init the pool used for the unit test
        pool = new Pool({
            connectionString: process.env.PG_URL,
            max: 5,
        });

        // Monkey patching and mocking the pool used in the model module
        model.__set__({
            'pool': pool
        });
    });
    beforeEach('Init the db', function(done){
        // Using the script to reset and set up the db with the test db setup
        scripts.db.dbInit(pool)
        .then(
            function(){
                done();
            }
        )
        .catch(done);
    });
    describe('DB set script and schema', function(){
        it('Check schema of DB', function(done){
            const checkQuery = `
            SELECT n.nspname as "Schema",                                                                                                                                                                 
            c.relname as "Name",                                                                                                                                                                        
            CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 's' THEN 'special' WHEN 'f' THEN 'foreign ta
            ble' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END as "Type",                                                                                                       
            pg_catalog.pg_get_userbyid(c.relowner) as "Owner"                                                                                                                                           
            FROM pg_catalog.pg_class c
                LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relkind IN ('r','p','')
                AND n.nspname <> 'pg_catalog'
                AND n.nspname <> 'information_schema'
                AND n.nspname !~ '^pg_toast'
            AND pg_catalog.pg_table_is_visible(c.oid)
            ORDER BY 1,2;
            `;
            pool.query(checkQuery)
            .then(
                function(res){
                    const expectedResult = [
                    {
                        Schema: 'public',
                        Name: 'tasksadvanced',
                        Type: 'table',
                        Owner: 'ppcwyyvc'
                    },
                    {
                        Schema: 'public',
                        Name: 'tasksbasic',
                        Type: 'table',
                        Owner: 'ppcwyyvc'
                    }
                    ];
                    // Checking if the result is the same
                    expect(JSON.stringify(res.rows)).to.be.equal(JSON.stringify(expectedResult));
                    done();
                }
            )
            .catch(
                function(err){
                    done(err);
                }
            );
        });
        it('Check custom pg types parsers', function(done){
            new Promise((resolve, reject) => {
                pool.query(`
                INSERT INTO TASKSBASIC
                (taskId, projectId, dueDate, dueTime, duration)
                VALUES
                (1, 11, '1998-02-02', '01:32:00', 2.123);
                `, function(err, res){
                    if(err){
                        reject(err);
                    }
                    resolve(res);
                });
            })
            .then(
                function(){
                    // Check for the datetime and float/decimal working
                    return new Promise((resolve, reject) => {
                        pool.query(`
                        SELECT * FROM TASKSBASIC;  
                        `, function(err, res){
                            if(err){
                                reject(err);
                                return;
                            }
                            resolve(res.rows[0]);
                        });
                    });
                }
            )
            .then(
                function(rows){
                    const expectedDateTime = moment('1998-02-02', 'YYYY-MM-DD');
                    const expectedDecimal = 2.123;
                    expect(JSON.stringify(rows['duedate'])).to.be.equal(JSON.stringify(expectedDateTime));
                    expect(rows['duration']).to.be.equal(expectedDecimal);
                    done();
                }
            )
            .catch(done);
        });
    });
    describe('Basic Problem Statement Models', function(){
        // Populating with preset data
        beforeEach('Placing in mock data for Basic Problem Statement', function(done){
            const tasks_query = `
            (1, 11, '1998-02-02', '01:32:00', 2),
            (2, 11, '1998-02-02', '01:32:00', 2),
            (3, 11, '1998-02-02', '01:32:00', 2),
            (4, 11, '1998-02-02', '01:32:00', 2),
            (5, 11, '1998-02-02', '01:32:00', 2),
            (6, 11, '1998-02-02', '01:32:00', 2),
            (7, 11, '1998-02-02', '01:32:00', 2),
            (8, 11, '1998-02-02', '01:32:00', 2),
            (9, 11, '1998-02-02', '01:32:00', 2),
            (10, 11, '1998-02-02', '01:32:00', 2),
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
            (taskId, projectId, dueDate, dueTime, duration)
            VALUES
            ${tasks_query}
            `, function(err){
                if(err){
                    done(err);
                }
                done();
            });
        });
        describe('Query and Get Data from the database', function(){
            it('Basic Functionality', function(done){
                const queryCondition = 'WHERE \nprojectId > 1 \nAND \nduration <= 10 \nORDER BY \nprojectId asc, taskId asc\nLIMIT 5 OFFSET 5';
                new Promise((resolve) => {
                    resolve(
                        model.basic.getData(queryCondition)
                        .catch(
                            function(err){
                                done(err);
                            }
                        )
                    );
                })
                .then(
                    function(res){
                        const expectedDataResult = [
                            {
                                taskid: '6',
                                duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                duetime: '01:32:00',
                                duration: 2,
                                projectid: '11'
                            },
                            {
                                taskid: '7',
                                duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                duetime: '01:32:00',
                                duration: 2,
                                projectid: '11'
                            },
                            {
                                taskid: '8',
                                duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                duetime: '01:32:00',
                                duration: 2,
                                projectid: '11'
                            },
                            {
                                taskid: '9',
                                duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                duetime: '01:32:00',
                                duration: 2,
                                projectid: '11'
                            },
                            {
                                taskid: '10',
                                duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                duetime: '01:32:00',
                                duration: 2,
                                projectid: '11'
                            }

                        ];
                        const expectedCountResult = [{
                            'count': '26'
                        }];
                        expect(res).to.be.lengthOf(2);
                        expect(JSON.stringify(res[0].rows)).to.be.equal(JSON.stringify(expectedDataResult));
                        expect(JSON.stringify(res[1].rows)).to.be.equal(JSON.stringify(expectedCountResult));
                        done();
                    }
                )
                .catch(
                    function(err){
                        done(err);
                    }
                );
            });
        });
        describe('Inserting data into the database', function(){
            it('Basic Functionality', function(done){
                const testTasks = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 11, \'1998-02-02\', \'01:32:00\', 22)'];
                new Promise((resolve) => {
                    resolve(
                        model.basic.insertTask(testTasks)
                        .catch(
                            function(err){
                                done(err);
                            }
                        )
                    );
                })
                .then(
                    function(){
                        return new Promise((resolve, reject) => {
                            pool.query(`
                            SELECT * FROM TASKSBASIC
                            WHERE taskId IN (11, 21)
                            `, function(err, res){
                                if(err){
                                    reject(err);
                                }
                                resolve(res);
                            });
                        })
                        .catch(
                            function(err){
                                done(err);
                            }
                        );
                    }
                )
                .then(
                    function(res){
                        const expectedResult = [
                        {
                            taskid: '11',
                            duedate: moment('1998-02-01', 'YYYY-MM-DD'),
                            duetime: '13:07:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '21',
                            duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                            duetime: '01:32:00',
                            duration: 22,
                            projectid: '11'
                        }
                        ];
                        // Checking if the result is as expected
                        expect(JSON.stringify(res.rows)).to.be.equal(JSON.stringify(expectedResult));
                        done();
                    }
                )
                .catch(
                    function(err){
                        done(err);
                    }
                );
            });
        });
        describe('Result Problem statement', function(){
            it('Basic Functionality', function(done){
                const projectId = 1100000004;
                new Promise((resolve) => {
                    resolve(
                        model.basic.getResults(projectId)
                    );
                })
                .then(
                    function(res){
                        const expectedData = [
                            {
                                "taskid":'1000000013',
                                "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                                "duetime":"12:00:00",
                                "duration":1,
                                "projectid":'1100000004'
                            },
                            {
                                "taskid":'1000000014',
                                "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                                "duetime":"14:00:00",
                                "duration":4,
                                "projectid":'1100000004'
                            },
                            {
                                "taskid":'1000000016',
                                "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                                "duetime":"15:00:00",
                                "duration":7,
                                "projectid":'1100000004'
                            },
                            {
                                "taskid":'1000000015',
                                "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                                "duetime":"19:00:00",
                                "duration":7,
                                "projectid":'1100000004'
                            },
                            {
                                "taskid":'1000000017',
                                "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                                "duetime":"19:00:00",
                                "duration":11,
                                "projectid":'1100000004'
                            }
                        ];
                        expect(JSON.stringify(res.rows)).to.be.equal(JSON.stringify(expectedData));
                        done();
                    }
                )
                .catch(done);
            });
            it('ProjectId does not exists', function(done){
                const projectId = 123;
                new Promise((resolve) => {
                    resolve(
                        model.basic.getResults(projectId)
                    );
                })
                .then(
                    function(){
                        done('Should not resolve');
                    }
                )
                .catch((err) => {
                    expect(err.code).to.be.equal('PROID');
                    done();
                });
            });
        });
    });
    describe('Advanced Problem Statement Models', function(){
        beforeEach('Placing in mock data for Advanced Problem Statement', function(done){
            const tasks_query = `
            (1, 11, 2),
            (2, 11, 2),
            (3, 11, 2),
            (4, 11, 2),
            (5, 11, 2),
            (6, 11, 2),
            (7, 11, 2),
            (8, 11, 2),
            (9, 11, 2),
            (10, 11, 2),
            (1001, 1001, 1),
            (1002, 1001, 2),
            (1003, 1001, 3)
            `;
            pool.query(`
            INSERT INTO TASKSADVANCED
            (taskId, projectId, duration)
            VALUES
            ${tasks_query}
            `, function(err){
                if(err){
                    done(err);
                }
                done();
            });
        });
        describe('Inserting data into the database', function(){
            it('Basic Functionality', function(done){
                const testTasks = ['(11, 11, 2)', '(21, 11, 22)'];
                new Promise((resolve) => {
                    resolve(
                        model.advanced.insertTask(testTasks)
                        .catch(
                            function(err){
                                done(err);
                            }
                        )
                    );
                })
                .then(
                    function(){
                        return new Promise((resolve, reject) => {
                            pool.query(`
                            SELECT * FROM TASKSADVANCED
                            WHERE taskId IN (11, 21)
                            `, function(err, res){
                                if(err){
                                    reject(err);
                                }
                                resolve(res);
                            });
                        })
                        .catch(
                            function(err){
                                done(err);
                            }
                        );
                    }
                )
                .then(
                    function(res){
                        const expectedResult = [
                        {
                            taskid: '11',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '21',
                            duration: 22,
                            projectid: '11'
                        }
                        ];
                        // Checking if the result is as expected
                        expect(JSON.stringify(res.rows)).to.be.equal(JSON.stringify(expectedResult));
                        done();
                    }
                )
                .catch(
                    function(err){
                        done(err);
                    }
                );
            });
        });
        describe('Query and get data from the database', function(){
            it('Basic Functionality', function(done){
                const queryCondition = 'WHERE \nprojectId > 1 \nAND \nduration <= 10 \nORDER BY \nprojectId asc, taskId asc\nLIMIT 5 OFFSET 5';
                model.advanced.getData(queryCondition)
                .then(
                    function(pgRes){
                        const expectedDataResult = [
                            {
                                'taskid': '6',
                                'duration': 2,
                                'projectid': '11',
                            },
                            {
                                'taskid': '7',
                                'duration': 2,
                                'projectid': '11'
                            },
                            {
                                'taskid': '8',
                                'duration': 2,
                                'projectid': '11'
                            },
                            {
                                'taskid': '9',
                                'duration': 2,
                                'projectid': '11'
                            },
                            {
                                'taskid': '10',
                                'duration': 2,
                                'projectid': '11'
                            },
                        ];
                        const expectedCountResult = [{
                            'count': '13'
                        }];
                        expect(pgRes).to.have.lengthOf(2);
                        expect(JSON.stringify(pgRes[0].rows)).to.be.equal(JSON.stringify(expectedDataResult));
                        expect(JSON.stringify(pgRes[1].rows)).to.be.equal(JSON.stringify(expectedCountResult));
                        done();
                    }
                )
                .catch(done);
            });
        });
        describe('Result Problem statement', function(){
            it('Basic Functionality', function(done){
                const projectId = 1001;
                new Promise((resolve) => {
                    resolve(
                        model.advanced.getResults(projectId)
                    );
                })
                .then(
                    function(res){
                        const expectedData = [
                            {
                                'taskid': '1001',
                                'duration': 1,
                                'projectid': '1001'
                            },
                            {
                                'taskid': '1002',
                                'duration': 2,
                                'projectid': '1001'
                            },
                            {
                                'taskid': '1003',
                                'duration': 3,
                                'projectid': '1001'
                            }
                        ];
                        expect(JSON.stringify(res.rows)).to.be.equal(JSON.stringify(expectedData));
                        done();
                    }
                )
                .catch(done);
            });
            it('ProjectId does not exists', function(done){
                const projectId = 10000;
                new Promise((resolve) => {
                    resolve(
                        model.advanced.getResults(projectId)
                    );
                })
                .then(
                    function(){
                        done('Should not resolve');
                    }
                )
                .catch(
                    function(err){
                        expect(err.code).to.be.equal('PROID');
                        done();
                    }
                );
            });
        });
    });
});
