/**
 * @fileoverview 
 * This is mostly a setup file for setting up the db
 * Meant for test and running once only
 * 
 * @author Lim Chuan Hao
 * 
 * @requires NPM:pg
 * 
 */

//  Importing the pg lib
const {Pool} = require('pg');

// Generating the pool obj to connect to the database
const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

// Query to create the tables
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

/**
 * @module js.obj
 * Contains the pool obj and functions for testing and setting up the db
 * 
 */
module.exports = { 
    init(){
        return pool.query(init);
    },
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

