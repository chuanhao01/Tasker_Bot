/**
 * @fileoverview 
 * This will be file containing all the models used for the basic problem and interacting with the basic tables
 * 
 * @author Lim Chuan Hao
 * 
 */

/**
 * @class 
 * @module
 * The class/singleton/object/module to hold all the models for the basic problem
 * 
 * @property pool
 * This is initialized when the constructor is called
 * Note: You are not supposed to directly access this property or call it
 * 
 */
const basicDB= {
    /**
     * @function
     * Constructor  
     * This is the constructor function to set up the basic model module
     * 
     * @param {pg_pool_object} pool The pg pool object that will be initialized 
     * 
     */
    init(pool){
        this.pool = pool;
    },

    // Inserting data into the tables
    /**
     * @function
     * Bulk insert for tasks pertaining to the basic problem
     * 
     * @param {Array} tasks an array of strings in '(taskId, projectId, dueDate, dueTime, duration)' checked and validated
     * Example: ['(11, 11, \'1998-02-01\', \'13:07:00\', 2)']
     * 
     * @returns {Promise} a promise call to the db inserting the tasks
     * 
     * @throws {Promise.error} if there is an error
     * 
     */
    insertTask(tasks){
        return new Promise((resolve, reject) => {
            let query_params = tasks.join(',\n');
            this.pool.query(`
            INSERT INTO TASKSBASIC
            (taskId, projectId, dueDate, dueTime, duration)
            VALUES
            ${query_params}
            `, function(err, res){
                if(err){
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    /**
     * @function
     * This is the function for the getData API endpoint, it returns the res object based on the selected tasks depending on the given queryConditions
     * Note: If the get data query returns nothing, it will return nothing
     *
     * @param {String} queryConditions The string of the query conditions given when the query params from the API request is parsed
     * 
     * @returns {Promise} A promise call to the db to get the data, resolves an array of pg res objects
     * The objects are [{
     * 'rows': data from db to be parsed
     * }, {
     * 'count': the total number of rows given the query condition
     * }]
     * 
     * @throws {Promise.error} if there is any pg error
     * 
     */
    getData(queryConditions){
        return new Promise((resolve, reject) => {
            // Removing the last line, so that it removes the limit for the total number of records
            const queryConditionsNoLimit = queryConditions.replace(/\r?\n?[^\r\n]*$/, "");
            this.pool.query(`
            SELECT * FROM TASKSBASIC
            ${queryConditions};

            SELECT COUNT(*) FROM(
                SELECT * FROM TASKSBASIC
                ${queryConditionsNoLimit}
            ) total;
            `, function(err, res){
                if(err || res.length !== 2){
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    /**
     * @function
     * This model call is to get the tasks associated to a projectId sorted by due date then due time
     * This is usually to calculate the basic problem statement later
     *
     * @param {number} projectId the projectId number of the project you want to calculate the basic result for
     * 
     * @returns {Promise} A promise call to the db to get the tasks associated with the projectId to calculate the basic result later on
     * Note that the tasks are already sorted
     * 
     * @throws {Promise.error} if there is any pg error
     * 
     */
    getResults(projectId){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM TASKSBASIC
            WHERE
                projectId = ${projectId}
            ORDER BY
                dueDate ASC, dueTime ASC; 
            `, function(err, res){
                if(err){
                    reject(err);
                    return;
                }
                if(res.rows.length === 0){
                    err = new Error('projectId does not exists or no tasks are associated with this projectId');
                    err.code = 'PROID';
                    reject(err);
                    return;
                }
                resolve(res);
                return;
            });
        });
    }
};

module.exports = basicDB;