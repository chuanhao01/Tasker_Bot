/**
 * @fileoverview 
 * This will be the file for the module containing the parser functions for parsing the data for output
 * 
 * @author Lim Chuan Hao
 * 
 */

/**
 * @class 
 * @module
 * The class/singleton/object/module for the dataParser
 * 
 */
const dataParser = {
    // Parent/global parsers to be used, mainly to parse to custom data types
    all: {
        /**
         * @function
         * This function parses a number into the HOURS data type, meant to be sent back as a response
         *
         * @param {Number} hours the hours in number format
         * 
         * @returns {Number} Number representation of the hours rounded off to 3dp
         * 
         */
        roundHours(hours){
            return parseFloat((Math.round((hours + Number.EPSILON) * 1000) / 1000).toString(10));
        },
        /**
         * @function
         * This function is to calculate the last page given the number of rows in the db and number of pages in a query
         *
         * @param {Number} rowCount The number of rows in the db based on the get model query, taken from req
         * @param {Number} pageNum The number of pages queried in the get request
         * 
         * @returns {Number} The Number representation of the last page of a given query
         * 
         */
        calculateLastPage(rowCount, pageNum){
            const lastPage = Math.ceil(rowCount/pageNum);
            return lastPage;
        }
    },

    // Data parsers specifically for the basic problem statement
    basic: {
        /**
         * @function
         * This function is to parse the data from the db request, from the pgRes object for the basic GET /basic/data
         *
         * @param {pg Response Obejct} pgRes The response object from the db model call
         * @param {Number} pageNum The pageNum query supplied in the get request, if not set to default
         * 
         * @returns {Object} The parsed data object that can be sent in the response
         * Returns the result object
         * 
         */
        getData(pgRes, pageNum){
            // Extracting data needed
            const data = pgRes[0].rows;
            const rowCount = parseInt(pgRes[1].rows[0].count);
            // Calculating last page and parsing duration into HOURS data type
            const lastPage = dataParser.all.calculateLastPage(rowCount, pageNum);
            // Calculating/Parsing the newData
            let newData = [];
            for(let task of data){
                // Getting the values
                let dueDate = task['duedate'];
                let dueTime = task['duetime'];
                let duration = task['duration'];
                let projectId = task['projectid'];
                let taskId = task['taskid'];
                // Formatting and parsing them
                dueDate = dueDate.format('YYYY/MM/DD');
                dueTime = dueTime.substring(0, 5);
                dueTime = dueTime.replace(':', '');
                duration = dataParser.all.roundHours(duration);
                projectId = parseInt(projectId);
                taskId = parseInt(taskId);
                // Creating new task to hold the new data
                let newTask = {
                    'dueDate': dueDate,
                    'dueTime': dueTime,
                    'duration': duration,
                    'projectId': projectId,
                    'taskId': taskId
                };
                newData.push(newTask);
            }
            const parsedData = {
                'data': newData,
                'lastPage': lastPage
            };
            return parsedData;
        },
        /**
         * @function
         * This is to parse the results for the basic problem statement
         * 
         * @param {Object} results refer to the object returned after the algorithms calculates the latesness
         * 
         * @returns {Object} Returns an object of parsed data that can be sent in the response
         * 
         */
        getResults(results){
            for(let task of results.data){ 
                task['taskId'] = parseInt(task['taskId']);
                task['deadlineDate'] = task['deadlineDate'].format('YYYY/MM/DD');
                task['deadlineTime'] = task['deadlineTime'].substring(0, 5).replace(':', '');
                task['lateness'] = dataParser.all.roundHours(task['lateness']);
            }
            results.totalLateness = dataParser.all.roundHours(results.totalLateness);
            const parsedResults = {
                'result': results.data,
                'totalLateness': results.totalLateness
            };
            return parsedResults;
        }
    },
    advanced: {
        /**
         * @function
         * This function is to parse the data from the db request, from the pgRes object, for the GET /advance/data
         *
         * @param {pg Response Obejct} pgRes The response object from the db model call
         * @param {Number} pageNum The pageNum query supplied in the get request, if not set to default
         * 
         * @returns {Object} The parsed data object that can be sent in the response
         * Returns the result object
         * 
         */
        getData(pgRes, pageNum){
            // Extracting data needed
            const data = pgRes[0].rows;
            const rowCount = parseInt(pgRes[1].rows[0].count);
            // Calculating last page and parsing duration into HOURS data type
            const lastPage = dataParser.all.calculateLastPage(rowCount, pageNum);
            // Calculating and parsing for the newData
            let newData = [];
            for(let task of data){
                // Extracing the values from task
                let projectId = task['projectid'];
                let taskId = task['taskid'];
                let duration = task['duration'];
                // Parsing the values
                projectId = parseInt(projectId);
                taskId = parseInt(taskId);
                duration = dataParser.all.roundHours(duration);
                // Creating the newTask
                let newTask = {
                    'projectId': projectId,
                    'taskId': taskId,
                    'duration': duration
                };
                newData.push(newTask);
            }
            const parsedData = {
                'data': newData,
                'lastPage': lastPage
            };
            return parsedData;
        },
        /**
         * @function
         * This function is to parse the data for the advance problem statement, data from the equally split algo
         * 
         * @param {Array} results The array of results return from advanced problem, equally split algo
         */
        getEqualSplitResults(results){
            // Parse all duration by rounding and parse to string
            let newResults = [];
            for(let tasks of results){
                let newTasks = [];
                for(let task of tasks){
                    // Extracing the values from task
                    let projectId = task['projectId'];
                    let taskId = task['taskId'];
                    let duration = task['duration'];
                    // Parsing the values
                    projectId = parseInt(projectId);
                    taskId = parseInt(taskId);
                    duration = dataParser.all.roundHours(duration);
                    // Creating the newTask
                    let newTask = {
                        'projectId': projectId,
                        'taskId': taskId,
                        'duration': duration
                    };
                    newTasks.push(newTask);
                }
                newResults.push(newTasks);
            }
            const parsedResults = {
                'result': newResults
            };
            return parsedResults;
        }
    }
};

module.exports = dataParser;