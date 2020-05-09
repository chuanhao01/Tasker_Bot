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
const expect = require('chai').expect;
const should = require('chai').should();

// Importing the custom utils to test
const utils = require('../utils/index');

// Tests below
describe('Utils test', function(){
    describe('Testing for dbPraser', function(){
        describe('For the basic parser', function(){
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
    describe('Testing for custom validator', function(){
        describe('For the basic validator', function(){
            describe('Testing the get data sortBy query params', function(){
                it('Query param exists', function(){
                    const result = utils.v.basic.getSortByQuery('');
                    expect(result).to.be.false;
                });
                it('Wrong attribute', function(){
                    const result = utils.v.basic.getSortByQuery('wrongattr.asc');
                    expect(result).to.be.false;
                });
                it('Wrong order', function(){
                    const result = utils.v.basic.getSortByQuery('projectId.whatOrder');
                    expect(result).to.be.false;
                });
                it('Only correct attribute', function(){
                    const result = utils.v.basic.getSortByQuery('projectId.');
                    expect(result).to.be.false;
                });
                it('Only correct order', function(){
                    const result = utils.v.basic.getSortByQuery('.asc');
                    expect(result).to.be.false;
                });
                it('Second empty', function(){
                    const result = utils.v.basic.getSortByQuery('projectId.asc,');
                    expect(result).to.be.false;
                });
                it('One Correct', function(){
                    const result = utils.v.basic.getSortByQuery('projectId.asc');
                    expect(result).to.be.true;
                });
                it('Multiple Correct', function(){
                    const result = utils.v.basic.getSortByQuery('projectId.asc,taskId.asc,duration.desc');
                    expect(result).to.be.true;
                });
            });
        });
    });
});