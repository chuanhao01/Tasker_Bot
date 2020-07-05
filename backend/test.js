require('dotenv').config();

const db = require('./db/index');
const utils = require('./utils');
const scripts = require('./scripts');

db.basic.getResults('1100000003')
.then(
    function(pgRes){
        const tasks = [];
        for(let task of pgRes.rows){
            let newTask = {
                'taskid': task.taskid,
                'duedate': `moment(${task.duedate.format('YYYY/MM/DD')}, "YYYY/MM/DD")`,
                'duetime': task.duetime,
                'duration': task.duration,
                'projectid': task.projectid
            };
            tasks.push(newTask);
        }
        console.log(tasks);
    }
);

// let tasks = [
//     {"taskId":1000000001,"projectId":1100000001,"dueDate":"2020/01/01","dueTime":"1100","duration":1},
//     {"taskId":1000000002,"projectId":1100000001,"dueDate":"2020/01/01","dueTime":"1100","duration":1},
//     {"taskId":1000000003,"projectId":1100000001,"dueDate":"2020/01/01","dueTime":"1100","duration":1},
//     {"taskId":1000000004,"projectId":1100000001,"dueDate":"2020/01/01","dueTime":"1100","duration":1},
//     {"taskId":1000000005,"projectId":1100000002,"dueDate":"2020/01/01","dueTime":"1400","duration":1},
//     {"taskId":1000000006,"projectId":1100000002,"dueDate":"2020/01/01","dueTime":"1400","duration":2},
//     {"taskId":1000000007,"projectId":1100000002,"dueDate":"2020/01/01","dueTime":"1400","duration":3},
//     {"taskId":1000000008,"projectId":1100000002,"dueDate":"2020/01/01","dueTime":"1400","duration":4},
//     {"taskId":1000000009,"projectId":1100000003,"dueDate":"2020/01/01","dueTime":"1100","duration":1},
//     {"taskId":1000000010,"projectId":1100000003,"dueDate":"2020/01/01","dueTime":"1300","duration":3},
//     {"taskId":1000000011,"projectId":1100000003,"dueDate":"2020/01/01","dueTime":"1500","duration":5},
//     {"taskId":1000000012,"projectId":1100000003,"dueDate":"2020/01/01","dueTime":"1700","duration":7},
//     {"taskId":1000000013,"projectId":1100000004,"dueDate":"2020/01/01","dueTime":"1200","duration":1},
//     {"taskId":1000000014,"projectId":1100000004,"dueDate":"2020/01/01","dueTime":"1400","duration":4},
//     {"taskId":1000000015,"projectId":1100000004,"dueDate":"2020/01/01","dueTime":"1900","duration":7},
//     {"taskId":1000000016,"projectId":1100000004,"dueDate":"2020/01/01","dueTime":"1500","duration":7},
//     {"taskId":1000000017,"projectId":1100000004,"dueDate":"2020/01/01","dueTime":"1900","duration":11}
// ];

// tasks = utils.dbParser.basic.bulkInsert(tasks);
// console.log(tasks.join(',\n'));

// db.pool.query(`
// SELECT * FROM TASKSBASIC
// `, function(err, res){
//     console.log(res);
// });

// const arr = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 21, \'1998-02-02\', \'01:32:00\', 22)'];
// db.basic.insertTask(arr)
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );
            

// var types = require('pg').types
// var Moment = require('moment');
// var parseDate = function parseDate(val) {
//     return val === null ? null : Moment(val)
// };

// var DATATYPE_DATE = 1082;
// types.setTypeParser(DATATYPE_DATE, function(val) {
//     return val === null ? null : parseDate(val)
// });

// var types = require('pg').types;
// var moment = require('moment');
// types.setTypeParser(1082, function(val) {
//     return val === null ? null : moment(val, 'YYYY-MM-DD');
// });

// const {Pool} = require('pg');
// const { util } = require('chai');

// let pool = new Pool({
//     connectionString: process.env.PG_URL,
//     max: 5,
// });
// let a = [
//     "(1, 11, '1998-02-02', '01:32:00', 2)",
//     "(2, 11, '1998-02-02', '01:32:00', 2)",
//     "(3, 11, '1998-02-02', '01:32:00', 3)",
//     "(4, 11, '1998-02-02', '01:32:00', 3)",
//     "(5, 11, '1998-02-02', '01:32:00', 4)",
//     "(6, 11, '1998-02-02', '01:32:00', 4)",
//     "(7, 11, '1998-02-02', '01:32:00', 2)",
//     "(8, 11, '1998-02-02', '01:32:00', 2)",
//     "(9, 11, '1998-02-02', '01:32:00', 2)",
//     "(10, 12, '1998-02-02', '01:32:00', 2)",
//     "(11, 12, '1998-02-02', '01:32:00', 2)",
//     "(12, 12, '1998-02-02', '01:32:00', 2)",
//     "(13, 13, '1998-02-02', '01:32:00', 2)",
//     "(14, 14, '1998-02-02', '01:32:00', 5)",
//     "(15, 11, '1998-02-02', '01:32:00', 2)",
//     "(16, 11, '1998-02-02', '01:32:00', 2)",
//     "(17, 11, '1998-02-02', '01:32:00', 2)",
//     "(18, 11, '1998-02-02', '01:32:00', 2)",
//     "(19, 11, '1998-02-02', '01:32:00', 2)",
//     "(20, 11, '1998-02-02', '01:32:00', 2)"
// ];

// console.log(a.join(',\n'));

// pool.query(`
//     SELECT duedate, duetime FROM tasksbasic
// `, function(err, res){
//     let row = res.rows[0];
//     // console.log(typeof(row.duedate));
//     console.log(row.duedate.toDate());
// });

// scripts.db.dbInit(pool);

// const queryConditions = `WHERE \nprojectId > 1 \nAND \nduration <= 10 \nORDER BY \nprojectId asc, taskId asc\nLIMIT 5 OFFSET 5`;
// db.basic.getData(queryConditions)
// .then(
//     function(res){
//         console.log(res[1].rows[0]);
//     }
// );

// pool.query(`
// SELECT * FROM TASKSBASIC
// WHERE taskId IN (11, 21)
// `, function(err, res){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log(res.rows);
// });

// let tasks = [];

// const basic_tasks = {
//     "taskId": 1,
//     "projectId": 1,
//     "duration": 3,
// };

// for(let i=0; i<20; i++){
//     let new_task = {};
//     new_task.taskId = basic_tasks.taskId + i;
//     new_task.projectId = basic_tasks.projectId;
//     new_task.duration = basic_tasks.duration;
//     tasks.push(new_task);
// }

// tasks = utils.dbParser.advanced.bulkInsert(tasks);

// console.log(tasks.join(',\n'));

// console.log(utils.dbParser.basic.bulkInsert(tasks));
// db.basic.insertTask(utils.dbParser.basic.bulkInsert(tasks))
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );

// scripts.db.dbInit(db.basic.pool)
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );

// db.basic.getData()
// .then(
//     function(res){
//         console.log(res.rows[0].duedate);
//     }
// );