/**
 * @fileoverview 
 * This is mostly a setup file for setting up the db
 * Meant for test and running once only
 * 
 * @author Lim Chuan Hao
 * 
 */


/**
 * @module 
 * This is the module containing all the scripts for dealing with the db
 * Note: This interface will be different from the normal models as with the script, all objects need will be passed into the function
 * In this case, it is the pg pool obj
 * This way, it will take on the property of whatever it needs to.
 * 
 */
const dbScripts = {
    /**
     * @function
     * Script to setup the tables for the database, given the pool obj
     * 
     * @param {pg_pool_obj} pool the pg pool object
     * 
     * @returns {Promise} returns a promise to the supplied pool connection to query and setup the tables
     * 
     */
    dbInit(pool){
        // Query to create the tables
        const init = `
        DROP TABLE IF EXISTS TASKSBASIC, TASKSADVANCED;

        CREATE TABLE IF NOT EXISTS TASKSBASIC(
            taskId BIGINT UNIQUE NOT NULL,
            dueDate DATE NOT NULL,
            dueTime TIME NOT NULL,
            duration INT NOT NULL,
            projectId BIGINT NOT NULL,
            PRIMARY KEY (taskId)
        );

        CREATE TABLE IF NOT EXISTS TASKSADVANCED(
            taskId BIGINT UNIQUE NOT NULL,
            duration INT NOT NULL,
            projectId BIGINT NOT NULL,
            PRIMARY KEY (taskId)
        );
        `;
        return pool.query(init);
    }
};

module.exports = dbScripts;