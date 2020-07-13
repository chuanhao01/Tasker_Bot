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
         * @returns {String} String representation of the hours rounded off to 3dp
         * 
         */
        roundHours(hours){
            return (Math.round((hours + Number.EPSILON) * 1000) / 1000).toString(10);
        },
        /**
         * @function
         * This function is to calculate the last page given the number of rows in the db and number of pages in a query
         *
         * @param {Number} rowCount The number of rows in the db based on the get model query, taken from req
         * @param {Number} pageNum The number of pages queried in the get request
         * 
         * @returns {String} The string representation of the last page of a given query
         * 
         */
        calculateLastPage(rowCount, pageNum){
            const lastPage = Math.ceil(rowCount/pageNum);
            return lastPage.toString(10);
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
            for(let i=0; i<data.length; i++){
                // Getting the values
                let dueDate = data[i].duedate.format('YYYY/MM/DD');
                let dueTime = `${data[i].duetime}`;
                let duration = data[i].duration;
                // Formatting and parsing them
                dueTime = dueTime.substring(0, 5);
                dueTime = dueTime.replace(':', '');
                duration = dataParser.all.roundHours(duration);
                // Setting values back
                data[i].duedate = dueDate;
                data[i].duetime = dueTime;
                data[i].duration = duration;
            }
            const parsedData = {
                'data': data,
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
        getResults(result){
            for(let task of result.data){ 
                task['lateness'] = dataParser.all.roundHours(task['lateness']);
            }
            result.totalLateness = dataParser.all.roundHours(result.totalLateness);
            const parsedResult = {
                'result': result.data,
                'totalLateness': result.totalLateness
            };
            return parsedResult;
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
            for(let task of data){
                task['duration'] = dataParser.all.roundHours(task['duration']);
            }
            const parsedData = {
                'data': data,
                'lastPage': lastPage
            };
            return parsedData;
        }
    }
};

module.exports = dataParser;