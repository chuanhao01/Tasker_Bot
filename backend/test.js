const db = require('./db/index');
const utils = require('./utils');

// const arr = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 21, \'1998-02-02\', \'01:32:00\', 22)'];
// db.basic.insertTask(arr)
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );
            

// const {Pool} = require('pg');

// let pool = new Pool({
//     connectionString: process.env.PG_URL,
//     max: 5,
// });

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

let tasks = [];

const basic_tasks = {
    "taskId": 1,
    "projectId": 11,
    "dueDate": "1998/02/02",
    "dueTime": "0132",
    "duration": 2,
};

for(let i=0; i<10; i++){
    let new_task = {};
    new_task.taskId = basic_tasks.taskId + i;
    new_task.projectId = basic_tasks.projectId;
    new_task.dueDate = basic_tasks.dueDate;
    new_task.dueTime = basic_tasks.dueTime;
    new_task.duration = basic_tasks.duration;
    tasks.push(new_task);
}

console.log(utils.dbParser.basic.bulkInsert(tasks));
db.basic.insertTask(utils.dbParser.basic.bulkInsert(tasks))
.then(
    function(res){
        console.log(res.rows);
    }
);