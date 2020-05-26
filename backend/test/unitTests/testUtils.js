/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * @requires NPM:chai
 * @requires NPM:moment
 * @requires ../../utils/index
 * 
 */

//  Importing libs needed to run the test
const moment = require('moment');
const expect = require('chai').expect;

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
                    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(expected_result));
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
                it('Making sure format is done correctly', function(){
                    /*
                    Note I am writing this here because there is a slight bug with node-pg
                    For date 1998-02-02 it returns as the string 1998-02-01T16:00:00.000Z
                    But using moment to parse it, it changes to 1998-02-02T00:00:00.000Z
                    But when parsed back to string, it is still 1998-02-01T16:00:00.000Z
                    So this test if for both
                    */
                    const testTasks = [
                        {
                            taskid: '6',
                            duedate: moment('1998-02-01T16:00:00.000Z'),
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                        {
                            taskid: '7',
                            duedate: moment('1998-02-02T00:00:00.000Z'),
                            duetime: '01:32:00',
                            duration: 2,
                            projectid: '11'
                        },
                    ];
                    const result = utils.dataParser.basic.getData(testTasks);
                    const expectedResult = [
                        {
                            taskid: 6,
                            duedate: '1998/02/02',
                            duetime: '0132',
                            duration: 2,
                            projectid: 11
                        },
                        {
                            taskid: 7,
                            duedate: '1998/02/02',
                            duetime: '0132',
                            duration: 2,
                            projectid: 11
                        },
                    ];
                    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(expectedResult));
                });
            });
        });
    });
});
