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
     * @param {param type} param_name param desc
     * 
     * @returns
     * 
     * @throws
     * 
     */
    insertTask(){

    }
};

module.exports = basic_db;