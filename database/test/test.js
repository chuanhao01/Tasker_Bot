const db = require('../src/index');

// const arr = ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)', '(21, 21, \'1998-02-02\', \'01:32:00\', 22)'];
// db.basic.insertTask(arr)
// .then(
//     function(res){
//         console.log(res.rows);
//     }
// );
            

const {Pool} = require('pg');

let pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

pool.query(`
SELECT * FROM TASKSBASIC
WHERE taskId IN (11, 21)
`, function(err, res){
    if(err){
        console.log(err);
        return;
    }
    console.log(res.rows);
});
