/**
 * @fileoverview 
 * This will be the file for the module containing the parser functions for both basic and advanced db models
 * 
 * @author Lim Chuan Hao
 * 
 */


/**
 * @class 
 * @module
 * The class/singleton/object/module for the db model inputs
 * 
 */
const dbParser = {
    // The parser for the basic problems
    basic: {
        // Parsing for the basic db models
        /**
         * @function
         * Parsing the tasks objects from the api controller into the insert statement needed for postgresql
         * 
         * @param {Array} tasks an array of tasks objects, tasks template
         * {
         * taskId : int,
         * projectId: int,
         * dueDate: string in the format of '2020/01/13',
         * dueTime: string in the format of '1200',
         * duration: int
         * }
         * Example: 
         * [{
         * "taskId": 1234567890,
         * "projectId": 1234567890,
         * "dueDate": "2020/01/13",
         * "dueTime": "2200",
         * "duration": 1,
         * }, ...]
         * 
         * @returns {Array} An array of string in the insert () format, used to db.basic.insertTasks
         * 
         */
        bulkInsert(tasks){
            let new_tasks = [];
            for(let task of tasks){
                // Custom parsing for the time
                const new_time = `${task.dueTime.substring(0, 2)}:${task.dueTime.substring(2, 4)}:00`;
                new_tasks.push(`(${task.taskId}, ${task.projectId}, '${task.dueDate.replace(new RegExp('/', 'g'), '-')}', '${new_time}', ${task.duration})`);
            }
            return new_tasks;
        }
    }
};

module.exports = dbParser;