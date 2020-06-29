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
};

module.exports = advancedDB;