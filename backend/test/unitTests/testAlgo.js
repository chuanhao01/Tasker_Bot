/**
 * @fileoverview 
 * Mocha test for testing and checking the algos to calcualte the results
 * This is for both the basic and advanced problem statement
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:chai
 * @requires moment
 * @requires ../../algo/index.js
 * 
 */

// Importing libraries needed
const expect = require('chai').expect;
const moment = require('moment');

// Importing own modules
const algo = require('../../algo/index');

describe('Algo Test Suite', function(){
    describe('Basic problem', function(){
        it('Testing normal functionality 1', function(){
            const tasks = [
                {
                    "taskid":'1000000001',
                    "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                    "duetime":"11:00:00",
                    "duration":1,
                    "projectid":'1100000001'
                },
                {
                    "taskid":'1000000002',
                    "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                    "duetime":"11:00:00",
                    "duration":1,
                    "projectid":'1100000001'
                },
                {
                    "taskid":'1000000003',
                    "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                    "duetime":"11:00:00",
                    "duration":1,
                    "projectid":'1100000001'
                },
                {
                    "taskid":'1000000004',
                    "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                    "duetime":"11:00:00",
                    "duration":1,
                    "projectid":'1100000001'
                }
            ];
            const startDate = '2020/01/01', startTime = '0900';
            const basicResults = algo.basic.calculateResults(tasks, startDate, startTime);
            const expectedResults = {
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
            expect(JSON.stringify(basicResults)).to.be.equal(JSON.stringify(expectedResults));
        });
        it('Testing normal functionality 2', function(){
            const tasks = [
                {
                    taskid: '1000000009',
                    duedate: moment('2020/01/01', "YYYY/MM/DD"),
                    duetime: '11:00:00',
                    duration: 1,
                    projectid: '1100000003'
                },
                {
                    taskid: '1000000010',
                    duedate: moment('2020/01/01', "YYYY/MM/DD"),
                    duetime: '13:00:00',
                    duration: 3,
                    projectid: '1100000003'
                },
                {
                    taskid: '1000000011',
                    duedate: moment('2020/01/01', "YYYY/MM/DD"),
                    duetime: '15:00:00',
                    duration: 5,
                    projectid: '1100000003'
                },
                {
                    taskid: '1000000012',
                    duedate: moment('2020/01/01', "YYYY/MM/DD"),
                    duetime: '17:00:00',
                    duration: 7,
                    projectid: '1100000003'
                }
            ];
            const startDate = '2020/01/01', startTime = '0900';
            const basicResults = algo.basic.calculateResults(tasks, startDate, startTime);
            const expectedResults = {
                'data': [
                    {
                        taskId: '1000000009',
                        deadlineDate: moment('2020/01/01', "YYYY/MM/DD"),
                        deadlineTime: '11:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '0900',
                        toDate: '2020/01/01',
                        toTime: '1000',
                        lateness: 0
                    },
                    {
                        taskId: '1000000010',
                        deadlineDate: moment('2020/01/01', "YYYY/MM/DD"),
                        deadlineTime: '13:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '1000',
                        toDate: '2020/01/01',
                        toTime: '1300',
                        lateness: 0
                    },
                    {
                        taskId: '1000000011',
                        deadlineDate: moment('2020/01/01', "YYYY/MM/DD"),
                        deadlineTime: '15:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '1300',
                        toDate: '2020/01/01',
                        toTime: '1800',
                        lateness: 3
                    },
                    {
                        taskId: '1000000012',
                        deadlineDate: moment('2020/01/01', "YYYY/MM/DD"),
                        deadlineTime: '17:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '1800',
                        toDate: '2020/01/02',
                        toTime: '0100',
                        lateness: 8
                    }
                ],
                'totalLateness': 11
            };
            expect(JSON.stringify(basicResults)).to.be.equal(JSON.stringify(expectedResults));
        });
        it('Testing normal functionality 3', function(){
            const tasks = [
                {
                    taskid: '1000000013',
                    duedate: moment("2020/01/01", "YYYY/MM/DD"),
                    duetime: '12:00:00',
                    duration: 1,
                    projectid: '1100000004'
                },
                {
                    taskid: '1000000014',
                    duedate: moment("2020/01/01", "YYYY/MM/DD"),
                    duetime: '14:00:00',
                    duration: 4,
                    projectid: '1100000004'
                },
                {
                    taskid: '1000000016',
                    duedate: moment("2020/01/01", "YYYY/MM/DD"),
                    duetime: '15:00:00',
                    duration: 7,
                    projectid: '1100000004'
                },
                {
                    taskid: '1000000015',
                    duedate: moment("2020/01/01", "YYYY/MM/DD"),
                    duetime: '19:00:00',
                    duration: 7,
                    projectid: '1100000004'
                },
                {
                    taskid: '1000000017',
                    duedate: moment("2020/01/01", "YYYY/MM/DD"),
                    duetime: '19:00:00',
                    duration: 11,
                    projectid: '1100000004'
                }
            ];
            const startDate = '2020/01/01', startTime = '0900';
            const basicResults = algo.basic.calculateResults(tasks, startDate, startTime);
            const expectedResults = {
                'data': [
                    {
                        taskId: '1000000013',
                        deadlineDate: moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime: '12:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '0900',
                        toDate: '2020/01/01',
                        toTime: '1000',
                        lateness: 0
                    },
                    {
                        taskId: '1000000014',
                        deadlineDate: moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime: '14:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '1000',
                        toDate: '2020/01/01',
                        toTime: '1400',
                        lateness: 0
                    },
                    {
                        taskId: '1000000016',
                        deadlineDate: moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime: '15:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '1400',
                        toDate: '2020/01/01',
                        toTime: '2100',
                        lateness: 6
                    },
                    {
                        taskId: '1000000015',
                        deadlineDate: moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime: '19:00:00',
                        fromDate: '2020/01/01',
                        fromTime: '2100',
                        toDate: '2020/01/02',
                        toTime: '0400',
                        lateness: 9
                    },
                    {
                        taskId: '1000000017',
                        deadlineDate: moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime: '19:00:00',
                        fromDate: '2020/01/02',
                        fromTime: '0400',
                        toDate: '2020/01/02',
                        toTime: '1500',
                        lateness: 20
                    }
                ],
                'totalLateness': 35
            };
            expect(JSON.stringify(basicResults)).to.be.equal(JSON.stringify(expectedResults));
        });
        it('Testing normal functionality with decimal 1', function(){
            const tasks = [
                {
                    "taskid":'1000000001',
                    "duedate":moment("2020/01/01", "YYYY/MM/DD"),
                    "duetime":"11:00:00",
                    "duration":2.123,
                    "projectid":'1100000001'
                },
            ];
            const startDate = '2020/01/01', startTime = '0900';
            const basicResults = algo.basic.calculateResults(tasks, startDate, startTime);
            const expectedResults = {
                'data': [
                    {
                        taskId:'1000000001',
                        deadlineDate:moment("2020/01/01", "YYYY/MM/DD"),
                        deadlineTime:"11:00:00",
                        fromDate: '2020/01/01',
                        fromTime: '0900',
                        toDate: '2020/01/01',
                        toTime: '1107',
                        lateness: 0.123
                    },
                ],
                'totalLateness': 0.123
            };
            expect(JSON.stringify(basicResults)).to.be.equal(JSON.stringify(expectedResults));
        });
    });
    describe('Advanced problem', function(){
        describe('Problem to equally split tasks, among 2 ppl', function(){
            it('Basic Functionality', function(){
                const tasks = [
                    {
                        'projectid': '1',
                        'taskid': '1',
                        'duration': 1
                    }
                ];
                const advancedResults = algo.advanced.splitEqual.calculateResults(tasks, 0.5);
                const expectedResults = [
                    [
                        {
                            'projectid': '1',
                            'taskid': '1',
                            'duration': 1
                        }
                    ],
                    []
                ];
                expect(JSON.stringify(advancedResults)).to.be.equal(JSON.stringify(expectedResults));
            });
            it('Basic Functionality 2', function(){
                const tasks = [
                    {
                        'projectid': '1',
                        'taskid': '1',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '2',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '3',
                        'duration': 2,
                    },
                    {
                        'projectid': '1',
                        'taskid': '4',
                        'duration': 2,
                    }
                ];
                const advancedResults = algo.advanced.splitEqual.calculateResults(tasks);
                const expectedResults = [
                    [
                        {
                            'projectid': '1',
                            'taskid': '2',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '4',
                            'duration': 2,
                        }
                    ],
                    [
                        {
                            'projectid': '1',
                            'taskid': '1',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '3',
                            'duration': 2,
                        }
                    ]
                ];
                expect(JSON.stringify(advancedResults)).to.be.equal(JSON.stringify(expectedResults));
            });
            it('Basic Functionality 3', function(){
                const tasks = [
                    {
                        'projectid': '1',
                        'taskid': '1',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '2',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '3',
                        'duration': 2,
                    },
                    {
                        'projectid': '1',
                        'taskid': '4',
                        'duration': 2,
                    },
                    {
                        'projectid': '1',
                        'taskid': '5',
                        'duration': 1,
                    }
                ];
                const advancedResults = algo.advanced.splitEqual.calculateResults(tasks);
                const expectedResults = [
                    [
                        {
                            'projectid': '1',
                            'taskid': '2',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '4',
                            'duration': 2,
                        },
                        {
                            'projectid': '1',
                            'taskid': '5',
                            'duration': 1,
                        }
                    ],
                    [
                        {
                            'projectid': '1',
                            'taskid': '1',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '3',
                            'duration': 2,
                        }
                    ]
                ];
                expect(JSON.stringify(advancedResults)).to.be.equal(JSON.stringify(expectedResults));
            });
            it('Basic Functionality 4', function(){
                const tasks = [
                    {
                        'projectid': '1',
                        'taskid': '5',
                        'duration': 11,
                    },
                    {
                        'projectid': '1',
                        'taskid': '1',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '2',
                        'duration': 1,
                    },
                    {
                        'projectid': '1',
                        'taskid': '3',
                        'duration': 2,
                    },
                    {
                        'projectid': '1',
                        'taskid': '4',
                        'duration': 2,
                    },
                ];
                const advancedResults = algo.advanced.splitEqual.calculateResults(tasks);
                const expectedResults = [
                    [
                        {
                            'projectid': '1',
                            'taskid': '5',
                            'duration': 11,
                        }
                    ],
                    [
                        {
                            'projectid': '1',
                            'taskid': '1',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '2',
                            'duration': 1,
                        },
                        {
                            'projectid': '1',
                            'taskid': '3',
                            'duration': 2,
                        },
                        {
                            'projectid': '1',
                            'taskid': '4',
                            'duration': 2,
                        },
                    ]
                ];
                expect(JSON.stringify(advancedResults)).to.be.equal(JSON.stringify(expectedResults));
            });
        });
    });
});

