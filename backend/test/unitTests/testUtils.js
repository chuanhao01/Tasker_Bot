/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * @requires ../../utils/index
 * 
 */

//  Importing libs needed to run the test
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

// Importing the custom utils to test
const utils = require('../../utils/index');

// Tests below
describe('Utils test', function(){
    before('Checking env', function(){
        if(process.env.NODE_ENV === 'UNIT_TEST'){
            // Nothing to setup
            return;
        }
        else{
            this.skip();
        }
    });
    describe('Testing for dbPraser', function(){
        describe('Testing for the all/common parsers', function(){
            describe('Testing the get data query params parser', function(){
                it('Testing default, when no query params', function(){
                    const result = utils.dbParser.all.getDataQueryParams({});
                    expect(result).to.be.equal(`LIMIT 10`);
                });
                it('Testing projectId only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "projectId": {
                            ">": "1"
                        },
                    });
                    expect(result).to.be.equal('WHERE \nprojectId > 1 \nLIMIT 10 ');
                });
                it('Testing projectId and duration', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "projectId": {
                            ">": "1"
                        },
                        "duration": {
                            "<=": "10"
                        },
                    });
                    expect(result).to.be.equal('WHERE \nprojectId > 1 \nAND \nduration <= 10 \nLIMIT 10 ');
                });
                it('Testing sortBy', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "sortBy": "projectId.asc,taskId.asc",
                    });
                    expect(result).to.be.equal('ORDER BY \nprojectId asc, taskId asc\nLIMIT 10 ');
                });
                it('Testing page only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "page": "10",
                    });
                    expect(result).to.be.equal('LIMIT 10 OFFSET 90');
                });
                it('Testing pageNum only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "pageNum": "5"
                    });
                    expect(result).to.be.equal('LIMIT 5 ');
                });
                it('Testing pageNum and page', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "page": "5",
                        "pageNum": "5"
                    });
                    expect(result).to.be.equal('LIMIT 5 OFFSET 20');
                });
                it('Testing all at once', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "projectId": {
                            ">": "1"
                        },
                        "duration": {
                            "<=": "10"
                        },
                        "sortBy": "projectId.asc,taskId.asc",
                        "page": "5",
                        "pageNum": "5"
                    });
                    expect(result).to.be.equal('WHERE \nprojectId > 1 \nAND \nduration <= 10 \nORDER BY \nprojectId asc, taskId asc\nLIMIT 5 OFFSET 20');
                });
            });
        });
        describe('For the basic parser', function(){
            describe('Testing bulk insert', function(){
                it('Functionality test', function(){
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
    describe('Test for data parser', function(){
        describe('For basic parser', function(){
            describe('Parsing get data', function(){
                // To do
                it('Making sure format is done correctly');
            });
        });
    });
});
