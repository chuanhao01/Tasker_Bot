require('dotenv').config();

const db = require('./db/index');
const utils = require('./utils');
const scripts = require('./scripts');

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

const {Pool} = require('pg');

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
//     "taskId": 11,
//     "projectId": 9,
//     "dueDate": "1998/02/02",
//     "dueTime": "0132",
//     "duration": 3,
// };

// for(let i=0; i<3; i++){
//     let new_task = {};
//     new_task.taskId = basic_tasks.taskId + i;
//     new_task.projectId = basic_tasks.projectId;
//     new_task.dueDate = basic_tasks.dueDate;
//     new_task.dueTime = basic_tasks.dueTime;
//     new_task.duration = basic_tasks.duration + i;
//     tasks.push(new_task);
// }

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