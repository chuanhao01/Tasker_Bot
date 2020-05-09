/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * @requires ../utils/index
 * 
 */

//  Importing libs needed to run the test
const assert = require('chai').assert;
const should = require('chai').should();

// Importing the custom utils to test
const utils = require('../utils/index');

describe('Utils test', function(){
    /**
     * @tests
     * This is the set of tasks to test out if the dbParser is working properly
     * 
     */
    describe('Testing for dbPraser', function(){
        /**
         * @tests
         * This is the set of tasks for the basic task parser
         * 
         */
        describe('For the basic parser', function(){
            /**
             * @test
             * To test if the bulk insert string is working
             * 
             */
            it('Testing bulk insert', function(){
                const test_tasks = [
                    {
                        "taskId": 11,
                        "projectId": 11,
                        "dueDate": "1998/02/01",
                        "dueTime": "1307",
                        "duration": 2,
                    },
                    {
                        "taskId": 21,
                        "projectId": 11,
                        "dueDate": "1998/02/02",
                        "dueTime": "0132",
                        "duration": 22,
                    }
                ];
                const result = utils.dbParser.basic.bulkInsert(test_tasks);
                const expected_result = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 11, \'1998-02-02\', \'01:32:00\', 22)'];
                JSON.stringify(result).should.be.equal(JSON.stringify(expected_result));
            });
        });
    });
});