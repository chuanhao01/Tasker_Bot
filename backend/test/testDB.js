/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * @requires ../src/index.js
 * 
 */

//  Importing libs needed to run the test
const {Pool} = require('pg');
const assert = require('chai').assert;
const should = require('chai').should();

// Define global var for pool
let pool;
before(
    function(){
        // Generating the pool obj to connect to the database
        pool = new Pool({
            connectionString: process.env.PG_URL,
            max: 5,
        });
    }
);

// Importing the custom model lib to test
const db = require('../src/index');

describe('DB test', function(){
    describe('Checking if the initialized of DB is done properly', function(){
        /**
         * @test  
         * This is a test to check if the db tables are initialized properly
         */
        it('Checking the initialized of the DB', function(done){
            const check_query = `
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
            pool.query(check_query)
            .then(
                function(res){
                    const expected_result = [
                    {
                        Schema: 'public',
                        Name: 'tasksadvanced',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    },
                    {
                        Schema: 'public',
                        Name: 'tasksbasic',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    }
                    ];
                    // Checking if the result is the same
                    JSON.stringify(res.rows).should.equal(JSON.stringify(expected_result));
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
    /**
     * This set of test is to make sure the basic db model functions works as expected
     * @tests 
     * 
     */
    describe('Checking basic model functions', function(){
        /**
         * This test is to make sure the insert data basic db call is working
         * @test
         *  
         */
        it('Checking the insert model of the basic db', function(done){
            const test_tasks = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 11, \'1998-02-02\', \'01:32:00\', 22)'];
            new Promise((resolve, reject) => {
                resolve(
                    db.basic.insertTask(test_tasks)
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
                    const expected_result = [
                    {
                        taskid: 11,
                        duedate: '1998-01-31T16:00:00.000Z',
                        duetime: '13:07:00',
                        duration: 2,
                        projectid: 11
                    },
                    {
                        taskid: 21,
                        duedate: '1998-02-01T16:00:00.000Z',
                        duetime: '01:32:00',
                        duration: 22,
                        projectid: 11
                    }
                    ];
                    // Checking if the result is as expected
                    JSON.stringify(res.rows).should.be.equal(JSON.stringify(expected_result));
                    done();
                }
            )
            .catch(
                function(err){
                    done(err);
                }
            );
        });
        /**
         * This is to make sure the mock data added is deleted after its done
         */
        after('Deleting the mocked data used for testing', function(){
            new Promise((resolve) => {
                pool.query(`
                DELETE FROM TASKSBASIC
                WHERE taskId IN (11, 21)
                `, function(err, data){
                    return;
                });
            });
        });
    });
});

