/**
 * @fileoverview 
 * This will be file containing all the models used for the basic problem and interacting with the basic tables
 * 
 * @author Lim Chuan Hao
 * 
 */

/**
 * The class/singleton/object/module to hold all the models for the basic problem
 * @class 
 * 
 * @property pool
 * This is initialized when the constructor is called
 * Note: You are not supposed to directly access this property or call it
 * 
 */

const basic_db = {
    /**
     * Constructor  
     * This is the constructor function to set up the basic model module
     * @function
     * 
     * @param {pg_pool_object} pool The pg pool object that will be initialized 
     * 
     */
    init(pool){
        this.pool = pool;
    },

    // Inserting data into the tables
    /**
     * function desc
     * @function
     * 
     * @param {Array} tasks an array of strings in '(taskId, projectId, dueDate, dueTime, duration)' checked and validated
     * 
     * @returns {Promise} a promise call to the db inserting the tasks
     * 
     * @throws {Promise.error} if there is an error
     * 
     */
    insertTask(tasks){
        return new Promise((resolve, reject) => {
            let query_params = tasks.join(',\n');
            console.log(query_params);
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
    }
};

module.exports = basic_db;