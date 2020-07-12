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
        }
    },

    // Data parsers specifically for the basic problem statement
    basic: {
        /**
         * @function
         * This parsing function is to parse the data to be sent for the get data api
         *
         * @param {Array} data The array of data from the get data model
         * task = {
         *      taskid: 6,
         *      duedate: '1998-02-01T16:00:00.000Z',
         *      duetime: '01:32:00',
         *      duration: 2,
         *      projectid: 11
         *  },
         * [
         * task, ...
         * ]
         * 
         * @returns {Array} Returns an array of tasks data parsed to be sent in the response of the get data API
         * 
         */
        getData(data){
            // Defining helper function to add padding
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
            return data;
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
         *
         * @param 
         * 
         * @returns 
         * 
         */
        getData(pgRes){

        }
    }
};

module.exports = dataParser;