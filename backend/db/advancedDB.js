/**
 * @fileoverview 
 * This will be file containing all the models used for the advanced problem and interacting with the advanced tables
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
const advancedDB = {
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

    /**
     * @function
     * Bulk insert for tasks pertaining to the advanced problem
     * 
     * @param {Array} tasks an array of strings in '(taskId, projectId, duration)' checked and validated
     * Example: ['(11, 11, 2)']
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
            INSERT INTO TASKSADVANCED
            (taskId, projectId, duration)
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
    getData(queryConditions){
        return new Promise((resolve, reject) => {
            // Removing the last line, so that it removes the limit for the total number of records
            const queryConditionsNoLimit = queryConditions.replace(/\r?\n?[^\r\n]*$/, "");
            this.pool.query(`
            SELECT * FROM TASKSADVANCED
            ${queryConditions};

            SELECT COUNT(*) FROM(
                SELECT * FROM TASKSADVANCED
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
     * Model call to select query the tasks with the given projectId
     * This is mainly used to get the tasks involved for the advanced result API
     * 
     * @param {Number} projectId The projectId that you want to calculate the advanced result for
     * 
     * @returns {Promise} A promise call to get the tasks with that projectId from the db
     * Note: The task are sorted by taskId
     * 
     * @throws {Promise.error} if there is a pg error
     */
    getResults(projectId){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM TASKSADVANCED
            WHERE
                projectid = ${projectId}
            ORDER BY
                taskid ASC
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

module.exports = advancedDB;