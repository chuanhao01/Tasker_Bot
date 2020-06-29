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
    // The parsers that can be used by both the advanced and basic problem statments api endpoints
    all: {
        /**
         * @function
         * This parsing function is to parse the req.query from the get data api endpoint, and turn the object into the sql statement for the model call
         *
         * @param {Object} query The req.query object from the api request, possible template may look like: 
         * {
         *     "projectId": {
         *         ">": "1"
         *     },
         *     "duration": {
         *         "<=": "10"
         *     },
         *     "sortBy": "projectId.asc,taskId.asc",
         *     "page": "1",
         *     "pageNum": "1"
         * }
         * 
         * @returns {String} The query string to be passed down to the model to call for the data
         * 
         */
        getDataQueryParams(query){
            // Deafult sql query to return if no query params are included
            if(query === {} || Object.keys(query).length === 0){
                return 'LIMIT 10';
            }
            let sqlString = '';
            /*
            Adding in the filters where they exists
            This is the WHERE clause in the select statement
            */
            if(query.projectId && query.duration){
                sqlString += `WHERE \n`;
                sqlString += `projectId ${Object.keys(query.projectId)[0]} ${Object.values(query.projectId)[0]} \n`;
                sqlString += `AND \n`;
                sqlString += `duration ${Object.keys(query.duration)[0]} ${Object.values(query.duration)[0]} \n`;
            }
            else if(query.projectId){
                sqlString += `WHERE \n`;
                sqlString += `projectId ${Object.keys(query.projectId)[0]} ${Object.values(query.projectId)[0]} \n`;
            }
            else if(query.duration){
                sqlString += `WHERE \n`;
                sqlString += `duration ${Object.keys(query.duration)[0]} ${Object.values(query.duration)[0]} \n`;
            }
            /*
            Now we will be adding sortBy order now, 
            Which is the ORDER BY clause in the select statement
            */
           if(query.sortBy){
               sqlString += `ORDER BY \n`;
                const sortOrders = query.sortBy.split(',');
                for(let i=0; i<sortOrders.length; i++){
                    const values = sortOrders[i].split('.');
                    if(i < sortOrders.length - 1){
                        sqlString += `${values[0]} ${values[1]}, `;
                    }
                    else{
                        sqlString += `${values[0]} ${values[1]}\n`;
                    }
                }
           }
           /*
           Adding pagination based on the query params
           This includes both the page and pageNum
           */
           // This is special as if there is no pageNum given, go back on default 10
           if(!('pageNum' in query)){
               query.pageNum = 10;
           }
           sqlString += `LIMIT ${query.pageNum} `;
           if(query.page){
               sqlString += `OFFSET ${(query.page - 1) * query.pageNum}`;
           }
           return sqlString;
        }
    },
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
        },
    },
    advanced: {
        /**
         * @function
         * Parsing the tasks objects for the advanced problem statement into the insert statement needed for postgresql
         * 
         * @param {Array} tasks an array of tasks objects, taken from the body of an API POST request
         * {
         * taskId : int,
         * projectId: int,
         * duration: int
         * }
         * Example: 
         * [{
         * "taskId": 1234567890,
         * "projectId": 1234567890,
         * "duration": 1,
         * }, ...]
         * 
         * @returns {Array} An array of strings to be used in the model
         * 
         */
        bulkInsert(tasks){
            let new_tasks = [];
            for(let task of tasks){
                new_tasks.push(`(${task.taskId}, ${task.projectId}, ${task.duration})`);
            }
            return new_tasks;
        }
    }
};

module.exports = dbParser;