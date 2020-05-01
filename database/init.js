const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

const init = `
DROP TABLE IF EXISTS PROJECTTASKSBASIC, TASKSBASIC, PROJECTSBASIC, PROJECTTASKSADVANCED, TASKSADVANCED, PROJECTSADVANCED;

CREATE TABLE IF NOT EXISTS PROJECTSBASIC(
    projectID INT UNIQUE NOT NULL,
    PRIMARY KEY(projectId)
);

CREATE TABLE IF NOT EXISTS TASKSBASIC(
    taskID INT UNIQUE NOT NULL,
    dueDate DATE NOT NULL,
    dueTime TIME NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTTASKSBASIC(
    projectID INT NOT NULL REFERENCES PROJECTSBASIC(projectID),
    taskID INT NOT NULL REFERENCES TASKSBASIC(taskID),
    PRIMARY KEY (projectID, taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTSADVANCED(
    projectID INT UNIQUE NOT NULL,
    PRIMARY KEY(projectId)
);

CREATE TABLE IF NOT EXISTS TASKSADVANCED(
    taskID INT UNIQUE NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTTASKSADVANCED(
    projectID INT NOT NULL REFERENCES PROJECTSADVANCED(projectID),
    taskID INT NOT NULL REFERENCES TASKSADVANCED(taskID),
    PRIMARY KEY (projectID, taskID)
);
`;

pool
.query(init)
.then(
    function(){
        return pool.query(`
        SELECT n.nspname as "Schema",                                                                                                                                                                 
        c.relname as "Name",                                                                                                                                                                        
        CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 's' THEN 'special' WHEN 'f' THEN 'foreign ta
        ble' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END as "Type",                                                                                                       
        pg_catalog.pg_get_userbyid(c.relowner) as "Owner"                                                                                                                                           
        FROM pg_catalog.pg_class c
            LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r','p','')
            AND n.nspname <> 'pg_catalog'
            AND n.nspname <> 'information_schema'
            AND n.nspname !~ '^pg_toast'
        AND pg_catalog.pg_table_is_visible(c.oid)
        ORDER BY 1,2;
        `);
    }
)
.then(
    function(data){
        console.log(data.rows);
    }
);

module.exports = { 
    init(){
        return pool.query(init);
    },
    pool: pool,
};


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

