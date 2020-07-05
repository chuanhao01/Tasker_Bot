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
                        fromDate: '2020/01/01',
                        fromTime: '0900',
                        toDate: '2020/01/01',
                        toTime: '1000',
                        lateness: 0
                    },
                    {
                        taskId:'1000000002',
                        fromDate: '2020/01/01',
                        fromTime: '1000',
                        toDate: '2020/01/01',
                        toTime: '1100',
                        lateness: 0
                    },
                    {
                        taskId:'1000000003',
                        fromDate: '2020/01/01',
                        fromTime: '1100',
                        toDate: '2020/01/01',
                        toTime: '1200',
                        lateness: 1
                    },
                    {
                        taskId:'1000000004',
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
                        fromDate: '2020/01/01',
                        fromTime: '0900',
                        toDate: '2020/01/01',
                        toTime: '1000',
                        lateness: 0
                    },
                    {
                        taskId: '1000000010',
                        fromDate: '2020/01/01',
                        fromTime: '1000',
                        toDate: '2020/01/01',
                        toTime: '1300',
                        lateness: 0
                    },
                    {
                        taskId: '1000000011',
                        fromDate: '2020/01/01',
                        fromTime: '1300',
                        toDate: '2020/01/01',
                        toTime: '1800',
                        lateness: 3
                    },
                    {
                        taskId: '1000000012',
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
    });
});

