const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

const init = `
DROP TABLE IF EXISTS TASKSWITHOUTDEADLINE, TASKS, PROJECTTYPES, PROJECTS;

CREATE TABLE IF NOT EXISTS PROJECTS(
    projectID SERIAL,
    projectUID VARCHAR(100) NOT NULL,
    PRIMARY KEY(projectUID)
);

CREATE TABLE IF NOT EXISTS PROJECTTYPES(
    projectUID VARCHAR(100) NOT NULL REFERENCES PROJECTS(projectUID) ON DELETE CASCADE,
    taskID SERIAL,
    taskType SMALLINT NOT NULL,
    taskUID VARCHAR(100) NOT NULL,
    PRIMARY KEY(projectUID, taskUID),
    UNIQUE(taskUID)
);

CREATE TABLE IF NOT EXISTS TASKS(
    taskUID VARCHAR(100) NOT NULL REFERENCES PROJECTTYPES(taskUID) ON DELETE CASCADE,
    dueDate DATE NOT NULL,
    dueTime TIME NOT NULL,
    duration INTEGER NOT NULL,
    PRIMARY KEY(taskUID)
);

CREATE TABLE IF NOT EXISTS TASKSWITHOUTDEADLINE(
    taskUID VARCHAR(100) NOT NULL REFERENCES PROJECTTYPES(taskUID) ON DELETE CASCADE,
    duration INTEGER NOT NULL,
    PRIMARY KEY(taskUID)
);
`;

pool
.query(init)
.then(
    function(data){
        console.log(data);
    }
);

// async function setUpDB(){
//     const client = await pool.connect()
//     try {
//         await client.query('BEGIN')
//         const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
//         const res = await client.query(queryText, ['brianc'])
//         const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
//         const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
//         await client.query(insertPhotoText, insertPhotoValues)
//         await client.query('COMMIT')
//     }
//     catch (e) {
//         await client.query('ROLLBACK')
//         throw e;
//     }
//     finally {
//         // At the end remember to release client cause we using low level stuff
//         client.release();
//     }
// }

// async () => {
//   // note: we don't try/catch this because if connecting throws an exception
//   // we don't need to dispose of the client (it will be undefined)
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
//     const res = await client.query(queryText, ['brianc'])
//     const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
//     const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
//     await client.query(insertPhotoText, insertPhotoValues)
//     await client.query('COMMIT')
//   } catch (e) {
//     await client.query('ROLLBACK')
//     throw e
//   } finally {
//     client.release()
//   }
// })().catch(e => console.error(e.stack))

