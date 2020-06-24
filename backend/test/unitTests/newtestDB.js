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
types.setTypeParser(1082, function(val) {
    return val === null ? null : moment(val, 'YYYY-MM-DD');
});

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
    // Init the testing db
    beforeEach('Init the db', function(done){
        // Init the pool used for the test
        pool = new Pool({
            connectionString: process.env.PG_URL,
            max: 5,
        });

        // Monkey patching and mocking the pool used in the model module
        model.__set__({
            'pool': pool
        });

        // Using the script to set up the db with the test db setup
        scripts.db.dbInit(pool)
        .then(
            function(){
                done();
            }
        )
        .catch(done);
    });
    // Populating with preset data
    beforeEach('Placing in mock data', function(done){
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
        (10, 11, '1998-02-02', '01:32:00', 2)
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
    describe('Checking DB scripts', function(){
        it('Checking if DB initialized properly ', function(done){
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
    });
    describe('Basic Problem Statement Models', function(){
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
                            'count': '10'
                        }];
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
    });
});
