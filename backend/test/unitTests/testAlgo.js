/**
 * @fileoverview 
 * Mocha test for testing and checking normal db functions
 * Meant to run while db is in production already
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
        it('Testing normal functionality', function(){
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
            const expectedResult = {
                'data': [
                    {
                        "taskid":'1000000001',
                        'fromDate': '2020/01/01',
                        'fromTime': '0900',
                        'toDate': '2020/01/01',
                        'toTime': '1000',
                        'lateness': 0
                    },
                    {
                        "taskid":'1000000002',
                        'fromDate': '2020/01/01',
                        'fromTime': '1000',
                        'toDate': '2020/01/01',
                        'toTime': '1100',
                        'lateness': 0
                    },
                    {
                        "taskid":'1000000003',
                        'fromDate': '2020/01/01',
                        'fromTime': '1100',
                        'toDate': '2020/01/01',
                        'toTime': '1200',
                        'lateness': 1
                    },
                    {
                        "taskid":'1000000004',
                        'fromDate': '2020/01/01',
                        'fromTime': '1200',
                        'toDate': '2020/01/01',
                        'toTime': '1300',
                        'lateness': 2
                    }
                ],
                'totalLateness': 3
            };
        });
    });
});

