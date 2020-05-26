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
 * @requires ../../db/index.js
 * @requires ../../scripts/index.js
 * 
 */

// Loading dotenv for the test
before('Making sure dotenv is loaded', function(){
    require('dotenv').config();
});

// Importing libs needed to run the test
const {Pool} = require('pg');
const expect = require('chai').expect;

// Define global var for pool
let pool;

// Importing the custom model lib to test
const model = require('../../db/index');
const scripts = require('../../scripts/index');

describe('DB unit test', function(){
    before('Checking env and setting pool accordingly', function(){
        if(process.env.NODE_ENV === 'UNIT_TEST'){
            // If the test env is set up, continue to do normal setup
            // Generating the pool obj to connect to the database
            pool = new Pool({
                connectionString: process.env.PG_URL,
                max: 5,
            });
        }
        else{
            this.skip();
        }
    });
    before('Init the db', function(done){
        // For async calls to be done before the test
        // Need to check if this should be passed along with the whole test suite
        if(process.env.NODE_ENV !== 'UNIT_TEST'){
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
        if(process.env.NODE_ENV !== 'UNIT_TEST'){
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
        new Promise((resolve, reject) => {
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
    describe('Checking if the initialized of DB is done properly', function(){
        it('Checking the initialized of the DB', function(done){
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
    describe('Checking basic model functions', function(){
        it('Checking the insert model of the basic db', function(done){
            const testTasks = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 11, \'1998-02-02\', \'01:32:00\', 22)'];
            new Promise((resolve, reject) => {
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
                function(res){
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
                        duedate: '1998-01-31T16:00:00.000Z',
                        duetime: '13:07:00',
                        duration: 2,
                        projectid: '11'
                    },
                    {
                        taskid: '21',
                        duedate: '1998-02-01T16:00:00.000Z',
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
        it('Checking the get data by query conditions', function(done){
            const queryCondition = 'WHERE \nprojectId > 1 \nAND \nduration <= 10 \nORDER BY \nprojectId asc, taskId asc\nLIMIT 5 OFFSET 5';
            new Promise((resolve, reject) => {
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
                    /*
                    Note of caution here, when stringfy the moment, although it is parsed to the correct date
                    The original string from db is somewhat wrong, that is why the stringfy is still wrong
                    */
                    const expectedResult = [
                        {
                            taskid: '6',
                            duedate: '1998-02-01T16:00:00.000Z',
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '7',
                            duedate: '1998-02-01T16:00:00.000Z',
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '8',
                            duedate: '1998-02-01T16:00:00.000Z',
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '9',
                            duedate: '1998-02-01T16:00:00.000Z',
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '10',
                            duedate: '1998-02-01T16:00:00.000Z',
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        }

                    ]
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

