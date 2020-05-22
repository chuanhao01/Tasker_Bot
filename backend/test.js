require('dotenv').config();

const db = require('./db/index');
const utils = require('./utils');
const scripts = require('./scripts');

// const arr = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 21, \'1998-02-02\', \'01:32:00\', 22)'];
// db.basic.insertTask(arr)
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );
            

var types = require('pg').types
var Moment = require('moment');
var parseDate = function parseDate(val) {
    return val === null ? null : Moment(val)
};

var DATATYPE_DATE = 1082;
types.setTypeParser(DATATYPE_DATE, function(val) {
    return val === null ? null : parseDate(val)
});

const {Pool} = require('pg');

let pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

// scripts.db.dbInit(pool);

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
//     "projectId": 9999999999,
//     "dueDate": "1998/02/02",
//     "dueTime": "0132",
//     "duration": 2,
// };

// for(let i=0; i<10; i++){
//     let new_task = {};
//     new_task.taskId = basic_tasks.taskId + i;
//     new_task.projectId = basic_tasks.projectId;
//     new_task.dueDate = basic_tasks.dueDate;
//     new_task.dueTime = basic_tasks.dueTime;
//     new_task.duration = basic_tasks.duration;
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

db.basic.getData()
.then(
    function(res){
        console.log(res.rows[0].duedate);
    }
);