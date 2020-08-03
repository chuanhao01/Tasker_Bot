/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:moment
 * @requires NPM:chai
 * @requires ../../utils/index
 * 
 */

//  Importing libs needed to run the test
const moment = require('moment');
const expect = require('chai').expect;

// Importing the custom utils to test
const utils = require('../../utils/index');

// Tests below
describe('Utils test suite', function(){
    describe('dbPraser', function(){
        describe('all/common parsers', function(){
            describe('Get Data Query Parameters Parser', function(){
                it('Default, no query params', function(){
                    const result = utils.dbParser.all.getDataQueryParams({});
                    expect(result).to.be.equal(`LIMIT 10`);
                });
                it('projectId only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "projectId": {
                            ">": "1"
                        },
                    });
                    expect(result).to.be.equal('WHERE \nprojectId > 1 \nLIMIT 10 ');
                });
                it('duration only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "duration": {
                            "<=": "10"
                        },
                    });
                    expect(result).to.be.equal('WHERE \nduration <= 10 \nLIMIT 10 ');
                });
                it('projectId and duration', function(){
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
                it('sortBy Single', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "sortBy": "projectId.asc",
                    });
                    expect(result).to.be.equal('ORDER BY \nprojectId asc\nLIMIT 10 ');
                });
                it('sortBy Multiple', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "sortBy": "projectId.asc,taskId.desc",
                    });
                    expect(result).to.be.equal('ORDER BY \nprojectId asc, taskId desc\nLIMIT 10 ');
                });
                it('page only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "page": "10",
                    });
                    expect(result).to.be.equal('LIMIT 10 OFFSET 90');
                });
                it('pageNum only', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "pageNum": "5"
                    });
                    expect(result).to.be.equal('LIMIT 5 ');
                });
                it('page and pageNum', function(){
                    const result = utils.dbParser.all.getDataQueryParams({
                        "page": "5",
                        "pageNum": "5"
                    });
                    expect(result).to.be.equal('LIMIT 5 OFFSET 20');
                });
                it('Testing all queries at once', function(){
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
        describe('basic parsers', function(){
            describe('Basic Bulk Insert', function(){
                it('Basic Functionality', function(){
                    const testTasks = [
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
                    const result = utils.dbParser.basic.bulkInsert(testTasks);
                    const expectedResult = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 11, \'1998-02-02\', \'01:32:00\', 22)'];
                    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(expectedResult));
                });
            });
        });
        describe('advacned parsers', function(){
            describe('Advanced Bulk Insert', function(){
                it('Basic Functionality', function(){
                    const testTasks = [
                        {
                            "taskId": 11,
                            "projectId": 11,
                            "duration": 2,
                        },
                        {
                            "taskId": 21,
                            "projectId": 11,
                            "duration": 22,
                        }
                    ];
                    const result = utils.dbParser.advanced.bulkInsert(testTasks);
                    const expectedResult = [`(11, 11, 2)`, `(21, 11, 22)`];
                    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(expectedResult));
                });
            });
        });
    });
    describe('validator', function(){
        describe('basic validator', function(){
            describe('sortBy query validator', function(){
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
    describe('dataParser', function(){
        describe('basic parser', function(){
            describe('basic Get Data parser', function(){
                it('Basic Functionality', function(){
                    const testModelData = [
                        {
                            'rows': [
                                {
                                    taskid: '6',
                                    duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                    duetime: '01:32:00',
                                    duration: 2.3211,
                                    projectid: '11'
                                },
                                {
                                    taskid: '7',
                                    duedate: moment('1998-02-02', 'YYYY-MM-DD'),
                                    duetime: '01:32:00',
                                    duration: 2,
                                    projectid: '11'
                                },
                            ]
                        },
                        {
                            'rows': [
                                {
                                    'count': 2
                                }
                            ]
                        }
                    ];
                    const result = utils.dataParser.basic.getData(testModelData, 10);
                    const expectedResult = {
                        'data': [
                            {
                                'dueDate': '1998/02/02', 
                                'dueTime': '0132',
                                'duration': 2.321,
                                'projectId': 11,
                                'taskId': 6,
                            },
                            {
                                'dueDate': '1998/02/02',
                                'dueTime': '0132',
                                'duration': 2,
                                'projectId': 11,
                                'taskId': 7,
                            },
                        ],
                        'lastPage': 1
                    };
                    expect(JSON.stringify(result)).to.be.equal(JSON.stringify(expectedResult));
                });
            });
            describe('Parsing the calculated results', function(){
                it('Basic Functionality', function(){
                    const testResults = {
                        'data': [
                            {
                                taskId:'1000000001',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '0900',
                                toDate: '2020/01/01',
                                toTime: '1000',
                                lateness: 0
                            },
                            {
                                taskId:'1000000002',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1000',
                                toDate: '2020/01/01',
                                toTime: '1100',
                                lateness: 0
                            },
                            {
                                taskId:'1000000003',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1100',
                                toDate: '2020/01/01',
                                toTime: '1200',
                                lateness: 1
                            },
                            {
                                taskId:'1000000004',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1200',
                                toDate: '2020/01/01',
                                toTime: '1300',
                                lateness: 2
                            }
                        ],
                        'totalLateness': 3
                    };
                    const data = utils.dataParser.basic.getResults(testResults);
                    const expectedData = {
                        'result': [
                            {
                                taskId:'1000000001',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '0900',
                                toDate: '2020/01/01',
                                toTime: '1000',
                                lateness: '0'
                            },
                            {
                                taskId:'1000000002',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1000',
                                toDate: '2020/01/01',
                                toTime: '1100',
                                lateness: '0'
                            },
                            {
                                taskId:'1000000003',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1100',
                                toDate: '2020/01/01',
                                toTime: '1200',
                                lateness: '1'
                            },
                            {
                                taskId:'1000000004',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1200',
                                toDate: '2020/01/01',
                                toTime: '1300',
                                lateness: '2'
                            }
                        ],
                        'totalLateness': '3'
                    };
                    expect(JSON.stringify(data)).to.be.equal(JSON.stringify(expectedData));
                });
                it('3dp rounding functionality', function(){
                    const testResults = {
                        'data': [
                            {
                                taskId:'1000000001',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '0900',
                                toDate: '2020/01/01',
                                toTime: '1000',
                                lateness: 1.33333333333333333
                            },
                            {
                                taskId:'1000000002',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1000',
                                toDate: '2020/01/01',
                                toTime: '1100',
                                lateness: 0.123333333333333
                            },
                            {
                                taskId:'1000000003',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1100',
                                toDate: '2020/01/01',
                                toTime: '1200',
                                lateness: 4.999999999999999
                            },
                            {
                                taskId:'1000000004',
                                deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                                deadlineTime:"11:00:00",
                                fromDate: '2020/01/01',
                                fromTime: '1200',
                                toDate: '2020/01/01',
                                toTime: '1300',
                                lateness: 10.23451111111111
                            }
                        ],
                        'totalLateness': 16.691177777777774
                    };
                    const data = utils.dataParser.basic.getResults(testResults);
                    const expectedData = {
                        'result': [
                            {
                                taskId:'1000000001',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '0900',
                                toDate: '2020/01/01',
                                toTime: '1000',
                                lateness: '1.333'
                            },
                            {
                                taskId:'1000000002',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1000',
                                toDate: '2020/01/01',
                                toTime: '1100',
                                lateness: '0.123'
                            },
                            {
                                taskId:'1000000003',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1100',
                                toDate: '2020/01/01',
                                toTime: '1200',
                                lateness: '5'
                            },
                            {
                                taskId:'1000000004',
                                deadlineDate: '2020/01/01',
                                deadlineTime: '1100',
                                fromDate: '2020/01/01',
                                fromTime: '1200',
                                toDate: '2020/01/01',
                                toTime: '1300',
                                lateness: '10.235'
                            }
                        ],
                        'totalLateness': '16.691'
                    };
                    expect(JSON.stringify(data)).to.be.equal(JSON.stringify(expectedData));
                });
            });
        });
        describe('For the advanced parser', function(){
            describe('Parsing the calculated results for the equally split', function(){
                it('Basic Functionality', function(){
                    const results = [
                        [
                            {
                                'projectId': '1',
                                'taskId': '2',
                                'duration': 1,
                            },
                            {
                                'projectId': '1',
                                'taskId': '4',
                                'duration': 2,
                            }
                        ],
                        [
                            {
                                'projectId': '1',
                                'taskId': '1',
                                'duration': 1,
                            },
                            {
                                'projectId': '1',
                                'taskId': '3',
                                'duration': 2,
                            }
                        ]
                    ];
                    const parsedResults = utils.dataParser.advanced.getEqualSplitResults(results);
                    const expectedParsedResults = {
                        "result": [
                            [
                                {
                                    'projectId': '1',
                                    'taskId': '2',
                                    'duration': '1',
                                },
                                {
                                    'projectId': '1',
                                    'taskId': '4',
                                    'duration': '2',
                                }
                            ],
                            [
                                {
                                    'projectId': '1',
                                    'taskId': '1',
                                    'duration': '1',
                                },
                                {
                                    'projectId': '1',
                                    'taskId': '3',
                                    'duration': '2',
                                }
                            ]
                        ]
                    };
                    expect(JSON.stringify(parsedResults)).to.be.equal(JSON.stringify(expectedParsedResults));
                });
                it('Basic Functionality 2', function(){
                    const results = [
                        [
                            {
                                'projectId': '1',
                                'taskId': '2',
                                'duration': 1,
                            },
                            {
                                'projectId': '1',
                                'taskId': '4',
                                'duration': 2,
                            },
                            {
                                'projectId': '1',
                                'taskId': '5',
                                'duration': 1,
                            }
                        ],
                        [
                            {
                                'projectId': '1',
                                'taskId': '1',
                                'duration': 1,
                            },
                            {
                                'projectId': '1',
                                'taskId': '3',
                                'duration': 2,
                            }
                        ]
                    ];
                    const parsedResults = utils.dataParser.advanced.getEqualSplitResults(results);
                    const expectedParsedResults = {
                        "result": [
                            [
                                {
                                    'projectId': '1',
                                    'taskId': '2',
                                    'duration': '1',
                                },
                                {
                                    'projectId': '1',
                                    'taskId': '4',
                                    'duration': '2',
                                },
                                {
                                    'projectId': '1',
                                    'taskId': '5',
                                    'duration': '1',
                                }
                            ],
                            [
                                {
                                    'projectId': '1',
                                    'taskId': '1',
                                    'duration': '1',
                                },
                                {
                                    'projectId': '1',
                                    'taskId': '3',
                                    'duration': '2',
                                }
                            ]
                        ]
                    };
                    expect(JSON.stringify(parsedResults)).to.be.equal(JSON.stringify(expectedParsedResults));
                });
            });
        });
    });
});
