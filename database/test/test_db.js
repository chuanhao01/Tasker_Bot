/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * 
 */

//  Importing libs needed to run the test
const {Pool} = require('pg');
const assert = require('chai').assert;
const should = require('chai').should();

// Define global var for pool
let pool;

describe('DB test', function(){
    describe('Checking if the initialized of DB is done properly', function(){
        before(
            function(){
                // Generating the pool obj to connect to the database
                pool = new Pool({
                    connectionString: process.env.PG_URL,
                    max: 5,
                });
            }
        );
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
                        Name: 'projectsadvanced',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    },
                    {
                        Schema: 'public',
                        Name: 'projectsbasic',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    },
                    {
                        Schema: 'public',
                        Name: 'projecttasksadvanced',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    },
                    {
                        Schema: 'public',
                        Name: 'projecttasksbasic',
                        Type: 'table',
                        Owner: 'chuanhao01'
                    },
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
});

